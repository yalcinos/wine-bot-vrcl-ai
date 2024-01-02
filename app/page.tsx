"use client";

import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";

export default function Chat() {
  //useChat is a utility to allow you to easily create a conversational user interface for your chatbot application. It enables the streaming of chat messages from your AI provider, manages the state for chat input, and updates the UI automatically as new messages are received.
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: [
        { id: "1", role: "assistant", content: "Welcome to Commerce7 AI Bot!" },
      ],
      body: {
        tenantId: "spectrawinery",
        websiteUrl: "https://spectrawinery.template.commerce7.com/",
      },
    });
  console.log({ isLoading });
  return (
    <div className="overflow-y-hidden">
      <div className="flex flex-col max-w-md h-screen py-24 mx-auto overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex flex-col", {
              "items-end": m.role !== "assistant",
            })}
          >
            <ChatBubble message={m} />
          </div>
        ))}
        <form onSubmit={handleSubmit}>
          <ChatInput
            className="disabled:opacity-50 fixed bottom-0 w-full max-w-md p-2 mb-8  rounded shadow-xl"
            value={input}
            loading={isLoading}
            onChange={handleInputChange}
            placeholder="Say something... "
          />
        </form>
      </div>
    </div>
  );
}
