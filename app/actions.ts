"use server";

import { kv } from "@vercel/kv";
import { nanoid } from "ai";
import { cookies } from "next/headers";

export async function getChat(id?: string) {
  const chat = await kv.hgetall<any>(`chat:${id}`);
  if (!chat) {
    return null;
  }

  return chat;
}

export async function setCookie() {
  const cookie = cookies().get("yt_wine_bot_token");

  if (!cookie) {
    // Set cookie
    cookies().set("yt_wine_bot_token", nanoid(), { sameSite: "none" });
  }
}

export async function getCookie() {
  const cookie = cookies().get("yt_wine_bot_token");
  return cookie;
}
