import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { ChatGPTMessage } from "@/types";
import MarkdownLite from "./MarkdownLite";
import { cn } from "@/lib/utils";
import { type Message } from "ai";
interface ChatBubbleProps {
  className?: string;
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = (props) => {
  const { message } = props;
  const isAsistant = message.role === "assistant";
  const bubbleClass =
    message.role === "assistant"
      ? "float-left bg-gray-200 text-black"
      : "float-right bg-blue-400 text-white";

  return (
    <Card
      className={cn("flex mb-5 mx-5 items-end", {
        "float-left max-w-fit": isAsistant,
        "justify-end max-w-fit": !isAsistant,
      })}
    >
      <CardBody className={bubbleClass}>
        <div
          className={cn("flex items-end", {
            "justify-end": isAsistant,
          })}
        >
          <div
            className={cn(" space-y-2 max-w-xs mx-2 overflow-x-hidden", {
              "items-end": isAsistant,
              "items-start": !isAsistant,
            })}
          >
            <div>
              <MarkdownLite text={message.content} />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
export default ChatBubble;
