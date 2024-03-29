import React from "react";
import { Input, Spinner } from "@nextui-org/react";
import { ArrowRight } from "./icons/ArrowRight";

interface ChatInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  loading: boolean;
  className?: string;
  value: string;
}

const ChatInput: React.FC<ChatInputProps> = (props: any) => {
  const { onChange, placeholder, value, loading } = props;
  return (
    <div className="flex flex-col gap-4" {...props}>
      <div className="flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          disabled={loading}
          labelPlacement="outside"
          autoComplete="off"
          onChange={onChange}
          endContent={
            loading ? (
              <Spinner className="animate-spin" size="sm" color="primary" />
            ) : (
              <ArrowRight />
            )
          }
        />
      </div>
    </div>
  );
};
export default ChatInput;
