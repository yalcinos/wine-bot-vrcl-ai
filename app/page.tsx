import Chat from "@/components/Chat";
import { getChat } from "./actions";
import { cookies, headers } from "next/headers";

export default async function ChatPage(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const cookie = cookies().get("yt_wine_bot_token");
  const headersList = headers();
  const referer = headersList.get("referer");
  console.log("referer", referer);

  console.log("-------searcg params", searchParams);
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
        websiteUrl={referer}
      />
    );
  }
  const filterMessages = chat?.messages.filter(
    (message: any) => message.role !== "system"
  );

  return (
    <Chat initialMessages={filterMessages} id={chat?.id} websiteUrl={referer} />
  );
}
