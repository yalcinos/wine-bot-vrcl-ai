export type ChatGPTAgent =
  | "system"
  | "user"
  | "assistant"
  | "function"
  | "data"
  | "tool";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}
