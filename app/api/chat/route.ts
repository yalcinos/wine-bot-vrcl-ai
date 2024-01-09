import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse, nanoid } from "ai";
// import { MessageArraySchema } from "@/lib/validators/message";
import { Commerce7API } from "@/lib/commerce7-api";
import { chatbotPromptv3 } from "@/lib/prompts/chatbot-prompt-v3";
// import { ChatGPTMessage } from "@/types";
import { NextResponse } from "next/server";
import { rateLimitRequest } from "@/lib/rate-limit";
import { kv } from "@vercel/kv";
import { setCookie, getCookie } from "@/app/actions";

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
    const { messages, tenantId, websiteUrl, customerId, id } = json;

    const userId = tenantId;

    console.log("This is post,", tenantId, websiteUrl, customerId);

    // const parsedMessages = MessageArraySchema.parse(messages);
    // const parsedMessages = console.log("Test post", messages, tenantId);
    // const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => {
    //   return {
    //     role: message.isUserMessage ? "user" : "system",
    //     content: message.text,
    //   };
    // });

    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    const reservationQueryParams: Record<string, string> = {
      status: "in:Incomplete,Reserved,Paid,Checked In,No Show,Hold",
      reservationDate: `gte:${date}`,
    };

    // Only include customerId if it is defined
    if (customerId) {
      reservationQueryParams.customerId = customerId;
    }
    const products = await Commerce7API(tenantId, "v1/product");
    const reservations = await Commerce7API(
      tenantId,
      "v1/reservation",
      reservationQueryParams
    );

    await messages.unshift({
      role: "system",
      content: chatbotPromptv3(products, websiteUrl),
    });

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      stream: true,
      messages,
      n: 1,
      temperature: 0.1,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        const cookie = await getCookie();

        const title = json.messages[0].content.substring(0, 100);
        const id = json.id ?? cookie?.value;
        const createdAt = Date.now();
        const path = `/chat/${id}`;
        const payload = {
          id,
          title,
          createdAt,
          path,
          messages: [
            ...messages,
            {
              content: completion,
              role: "assistant",
            },
          ],
        };

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
