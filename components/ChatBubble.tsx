import React, { ReactNode } from "react";
import { Card, CardBody } from "@nextui-org/react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { type Message } from "ai";

interface ChatBubbleProps {
  className?: string;
  message: Message;
}

interface CustomTableProps {
  children: ReactNode;
}

const ChatBubble: React.FC<ChatBubbleProps> = (props) => {
  const { message } = props;
  const isAsistant = message.role === "assistant";
  const bubbleClass =
    message.role === "assistant"
      ? "float-left bg-gray-200 text-black"
      : "float-right bg-blue-400 text-white";

  const CustomTable: React.FC<CustomTableProps> = ({ children }) => {
    // Your custom table styling or modifications can go here
    return (
      <table className="table-auto mt-3 border-collapse border border-gray-300">
        {children}
      </table>
    );
  };

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
            className={cn("space-y-2 max-w-xs mx-2 overflow-x-hidden", {
              "items-end": isAsistant,
              "items-start": !isAsistant,
            })}
          >
            <div>
              <ReactMarkdown
                className="prose mt-1 w-full break-words prose-p:leading-relaxed"
                remarkPlugins={[remarkGfm]}
                components={{
                  // open links in new tab
                  table: CustomTable as any,
                  a: (props) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-words underline underline-offset-2 text-blue-600"
                    />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
export default ChatBubble;
