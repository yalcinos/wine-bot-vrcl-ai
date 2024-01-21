import React from "react";
import { Button, Input, Spinner } from "@nextui-org/react";
import { ArrowRight } from "./icons/ArrowRight";
import ChatBubble from "./ChatBubble";

interface WelcomeMessageProps {
  className?: string;
  onHandleButtonClick: (buttonText: string) => void;
}

const BUTTON_LIST = [
  {
    id: "2",
    text: "Recommend a red wine?",
  },
  {
    id: "3",
    text: "Recommend a white wine?",
  },
  {
    id: "2",
    text: "Show my reservations?",
  },
];

const WELCOME_MESSAGE =
  "Welcome to WineBot! 🍷\n\nI'm here to assist you with:\n\n1. 🍇 Wine Recommendations\n2. 🍽️ Food Pairing\n3. 🗓️ Show upcoming Reservations\n4. 📚 Wine Knowledge\n\n";

const WelcomeMessage: React.FC<WelcomeMessageProps> = (props: any) => {
  const { onHandleButtonClick } = props;

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const clickedButtonText = (event.currentTarget.textContent || "") as string;

    // Call the provided prop function with the button text
    onHandleButtonClick(clickedButtonText);
  };

  return (
    <div className="flex flex-col">
      <ChatBubble
        message={{
          id: "1",
          role: "assistant",
          content: WELCOME_MESSAGE,
        }}
      >
        <div>
          {BUTTON_LIST.map((button) => {
            return (
              <Button
                key={button.id}
                variant="ghost"
                // color="primary"
                className="mb-2"
                onClick={handleButtonClick}
              >
                {button.text}
              </Button>
            );
          })}
        </div>
      </ChatBubble>
    </div>
  );
};
export default WelcomeMessage;
