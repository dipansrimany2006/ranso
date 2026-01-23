import { db } from "../db";
import { chats } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface Chat {
  threadId: string;
  owner: string;
  messages: ChatMessage[];
  title?: string;
  createdAt?: string;
}

export async function getChatsByWallet(walletAddress: string) {
  const result = await db
    .select()
    .from(chats)
    .where(eq(chats.owner, walletAddress));

  return result.map((chat) => ({
    threadId: chat.threadId,
    owner: chat.owner,
    messages: chat.chats as ChatMessage[],
    title: (chat.chats as ChatMessage[])?.[0]?.content?.slice(0, 50) || "New Chat",
  }));
}

export async function getChatByThreadId(threadId: string) {
  const result = await db
    .select()
    .from(chats)
    .where(eq(chats.threadId, threadId))
    .limit(1);

  if (!result[0]) return null;

  return {
    threadId: result[0].threadId,
    owner: result[0].owner,
    messages: result[0].chats as ChatMessage[],
  };
}

export async function createOrUpdateChat(
  threadId: string,
  owner: string,
  messages: ChatMessage[]
) {
  const existing = await getChatByThreadId(threadId);

  if (existing) {
    await db
      .update(chats)
      .set({ chats: messages })
      .where(eq(chats.threadId, threadId));
  } else {
    await db.insert(chats).values({
      threadId,
      owner,
      chats: messages,
    });
  }

  return { threadId, owner, messages };
}

export async function deleteChat(threadId: string) {
  await db.delete(chats).where(eq(chats.threadId, threadId));
}
