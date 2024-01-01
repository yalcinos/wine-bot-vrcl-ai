"use client";

import ChatInput from "@/components/ChatInput";
import { Spinner } from "@nextui-org/react";
import { useChat } from "ai/react";

export default function Chat() {
  //useChat is a utility to allow you to easily create a conversational user interface for your chatbot application. It enables the streaming of chat messages from your AI provider, manages the state for chat input, and updates the UI automatically as new messages are received.
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: {
        tenantId: "spectrawinery",
        websiteUrl: "https://spectrawinery.template.commerce7.com/",
      },
    });
  console.log("Use message", isLoading);
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <ChatInput
          className="disabled:opacity-50 fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          isLoading={isLoading}
          onChange={handleInputChange}
          placeholder="Say something... "
        />
        {isLoading && <Spinner size="sm" color="primary" />}
        {/* // className="fixed bottom-0 w-full max-w-md p-2 mb-8 border
        border-gray-300 rounded shadow-xl" // value={input}
        // placeholder="Say something..." // onChange={handleInputChange} */}
      </form>
    </div>
  );
}
