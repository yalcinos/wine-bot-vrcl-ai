import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse, nanoid } from "ai";
// import { MessageArraySchema } from "@/lib/validators/message";
import { Commerce7API } from "@/lib/commerce7-api";
import {
  chatbotPromptv3,
  generateAddToCartLink,
  resturantPrompt,
} from "@/lib/prompts/chatbot-prompt-v3";

import { NextResponse } from "next/server";
import { rateLimitRequest } from "@/lib/rate-limit";
import { kv } from "@vercel/kv";
import { setCookie, getCookie } from "@/app/actions";
import { functions, runFunction } from "./functions";
import { encodingForModel } from "js-tiktoken";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const ip = req.headers.get("x-forwarded-for");
      await setCookie();
      // Use the rate limiter function
      const { success, limit, reset, remaining } = await rateLimitRequest(ip);

      if (!success) {
        return new Response(
          "You have reached your request limit for the day.",
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }
    } else {
      console.log(
        "KV_REST_API_URL and KV_REST_API_TOKEN env vars not found, not rate limiting..."
      );
    }

    const json = await req.json();
    let { messages, tenantId, websiteUrl, customerId } = json;

    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    const reservationQueryParams: Record<string, string> = {
      tenantId: tenantId,
      status: "in:Incomplete,Reserved,Paid,Checked In,No Show,Hold",
      dateRange: `gte:${date}`,
    };

    //set customer id for dev mode
    customerId =
      process.env.APP_MODE === "development"
        ? process.env.APP_DEMO_CLIENT_ID
        : customerId;

    // Only include customerId if it is defined
    if (customerId) {
      reservationQueryParams.customerId = customerId;
    }

    const combinedPrompt =
      chatbotPromptv3() +
      "\n" +
      generateAddToCartLink() +
      "\n" +
      resturantPrompt();

    await messages.unshift({
      role: "system",
      content: combinedPrompt,
    });

    const tiktoken = encodingForModel("gpt-3.5-turbo-1106"); // js-tiktoken

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      stream: true,
      messages,
      tools: functions,
      tool_choice: "auto",
      n: 1,
      temperature: 0.1,
    });
    let completionTokens = 0;
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response, {
      experimental_onToolCall: async ({ tools }, appendToolCallMessage) => {
        let result;

        for (const tool of tools) {
          if (
            tool.func.name === "get_wine_product_information" ||
            tool.func.name === "get_wine_sku"
          ) {
            result = await runFunction(tool.func.name, {
              tenantId: tenantId,
              websiteUrl:
                process.env.APP_MODE === "development"
                  ? process.env.APP_DEMO_URL
                  : websiteUrl,
            });
          } else
            result = await runFunction(tool.func.name, reservationQueryParams);

          //This method doesn't append function name (BUG?)
          appendToolCallMessage({
            tool_call_id: tool.id,
            function_name: tool.func.name,
            tool_call_result: result,
          });

          console.log("YAY!", tool.func.name);
        }

        return openai.chat.completions.create({
          model: "gpt-3.5-turbo-1106",
          stream: true,
          tools: functions,
          tool_choice: "auto",
          messages: [...messages, ...appendToolCallMessage()],
        });
      },
      async onToken(content) {
        const tokenList = tiktoken.encode(content);
        completionTokens += tokenList.length;
      },
      async onFinal(completion) {
        const cookie = await getCookie();
        const title = json.messages[0].content.substring(0, 100);
        const id = cookie?.value;
        const createdAt = Date.now();

        const payload = {
          id,
          title,
          createdAt,
          messages: [
            ...messages,
            {
              content: completion,
              role: "assistant",
            },
          ],
        };
        console.log(`Token count: ${completionTokens}`);
        await kv.hset(`chat:${id}`, payload);
      },
    });
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      throw error;
    }
  }
}
