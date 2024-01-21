import Chat from "@/components/Chat";
import { getChat, getCookie } from "../actions";
import { headers } from "next/headers";

export default async function ChatPage() {
  const cookie = await getCookie();

  const headersList = headers();
  //get the website url
  const referer = headersList.get("referer");

  const chat = await getChat(cookie?.value);

  if (!chat) {
    return <Chat websiteUrl={referer} />;
  }
  const filterMessages = chat?.messages.filter(
    (message: any) => message.role !== "system"
  );

  return (
    <Chat initialMessages={filterMessages} id={chat?.id} websiteUrl={referer} />
  );
}
