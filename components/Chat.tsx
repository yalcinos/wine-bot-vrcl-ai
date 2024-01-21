"use client";

import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import { ScrollToAnchor } from "@/components/ScrollToAnchor";
import { cn } from "@/lib/utils";
import { type Message, useChat } from "ai/react";
import { useSearchParams } from "next/navigation";

import { toast } from "react-toastify";
import WelcomeMessage from "./WelcomeMessage";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
  websiteUrl: string | null;
}
export default function Chat({ id, initialMessages, websiteUrl }: ChatProps) {
  const searchParams = useSearchParams();

  const tenantId = searchParams.get("tenantId");
  const customerId = searchParams.get("customerId");

  //useChat is a utility to allow you to easily create a conversational user interface for your chatbot application. It enables the streaming of chat messages from your AI provider, manages the state for chat input, and updates the UI automatically as new messages are received.
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
  } = useChat({
    id,
    initialMessages,
    body: {
      tenantId: tenantId,
      websiteUrl,
      customerId: customerId,
    },
    onError: (err) => {
      console.log({ err });
      toast.error(err.message);
    },
  });

  const handleButtonClick = (buttonText: string) => {
    // Your custom logic for handling button clicks in the parent component
    console.log("Button clicked in parent component! Button text:", buttonText);
    setInput(buttonText);
  };

  return (
    <div className="overflow-y-hidden">
      <div className="max-w-lg h-[90vh] pt-8 mx-auto overflow-y-auto">
        {messages.length ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={cn("flex flex-col", {
                "items-end": message.role !== "assistant",
              })}
            >
              <ChatBubble message={message} />
            </div>
          ))
        ) : (
          <WelcomeMessage onHandleButtonClick={handleButtonClick} />
        )}
        <ScrollToAnchor trackVisibility={isLoading} />
      </div>
      <div className="flex flex-col max-w-lg mx-auto">
        <form onSubmit={handleSubmit}>
          <ChatInput
            className="flex disabled:opacity-50 fixed bottom-0 w-full max-w-lg p-2 rounded shadow-xl"
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
