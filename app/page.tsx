import Chat from "@/components/Chat";
import { getChat } from "./actions";
import { cookies } from "next/headers";

export default async function ChatPage() {
  const cookie = cookies().get("yt_wine_bot_token");

  const chat = await getChat(cookie?.value);

  if (!chat) {
    return (
      <Chat
        initialMessages={[
          {
            id: "1",
            role: "assistant",
            content: "Welcome to Commerce7 AI Bot!",
          },
        ]}
      />
    );
  }
  const filterMessages = chat?.messages.filter(
    (message: any) => message.role !== "system"
  );

  return <Chat initialMessages={filterMessages} id={chat?.id} />;
}
