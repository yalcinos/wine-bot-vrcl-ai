import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { MessageArraySchema } from "@/lib/validators/message";
import { Commerce7API } from "@/lib/commerce7-api";
import { chatbotPromptv3 } from "@/lib/prompts/chatbot-prompt-v3";
import { ChatGPTMessage } from "@/types";
import { NextResponse } from "next/server";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, tenantId, websiteUrl } = await req.json();
    console.log("This is post,", tenantId, websiteUrl);
    // const parsedMessages = MessageArraySchema.parse(messages);
    // const parsedMessages = console.log("Test post", messages, tenantId);
    // const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => {
    //   return {
    //     role: message.isUserMessage ? "user" : "system",
    //     content: message.text,
    //   };
    // });

    const commerce7Response = await Commerce7API(tenantId);

    const productInfos = await commerce7Response.json();

    await messages.unshift({
      role: "assistant",
      content: chatbotPromptv3(productInfos, websiteUrl),
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
    const stream = OpenAIStream(response);
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
