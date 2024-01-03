"use client";

import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import { ScrollToAnchor } from "@/components/ScrollToAnchor";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { useSearchParams } from "next/navigation";

export default function Chat() {
  const searchParams = useSearchParams();

  const tenantId = searchParams.get("tenantId");
  const customerId = searchParams.get("customerId");

  const websiteUrl =
    window.location != window.parent.location
      ? document.referrer
      : document.location.href;

  //useChat is a utility to allow you to easily create a conversational user interface for your chatbot application. It enables the streaming of chat messages from your AI provider, manages the state for chat input, and updates the UI automatically as new messages are received.
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: [
        { id: "1", role: "assistant", content: "Welcome to Commerce7 AI Bot!" },
      ],
      body: {
        tenantId: tenantId,
        websiteUrl: websiteUrl,
      },
    });

  return (
    <div className="overflow-y-hidden">
      <div className="max-w-md h-[90vh] pt-8 mx-auto overflow-y-auto">
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
        <ScrollToAnchor trackVisibility={isLoading} />
      </div>
      <div className="flex flex-col max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <ChatInput
            className="flex disabled:opacity-50 fixed bottom-0 w-full max-w-md p-2  rounded shadow-xl"
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
