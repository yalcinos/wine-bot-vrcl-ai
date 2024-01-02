import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { ChatGPTMessage } from "@/types";
import MarkdownLite from "./MarkdownLite";

interface ChatBubbleProps {
  className?: string;
  message: ChatGPTMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = (props) => {
  const { message } = props;

  const bubbleClass =
    message.role === "assistant"
      ? "loat-left bg-gray-200 text-black"
      : "loat-right bg-blue-400 text-white";
  return (
    <Card className="mb-2">
      <CardBody className={bubbleClass}>
        <MarkdownLite text={message.content} />
      </CardBody>
    </Card>
  );
};
export default ChatBubble;
