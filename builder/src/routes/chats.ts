import { Hono } from "hono";
import {
  getChatsByWallet,
  getChatByThreadId,
  createOrUpdateChat,
  deleteChat,
  ChatMessage,
} from "../controllers/chats.controller";

const app = new Hono();

// Get all chats for a wallet
app.get("/:walletAddress", async (c) => {
  const walletAddress = c.req.param("walletAddress");

  try {
    const chatList = await getChatsByWallet(walletAddress);
    return c.json(chatList);
  } catch (err) {
    console.error("Failed to fetch chats:", err);
    return c.json({ error: "Failed to fetch chats" }, 500);
  }
});

// Get single chat by threadId
app.get("/thread/:threadId", async (c) => {
  const threadId = c.req.param("threadId");

  try {
    const chat = await getChatByThreadId(threadId);
    if (!chat) {
      return c.json({ error: "Chat not found" }, 404);
    }
    return c.json(chat);
  } catch (err) {
    console.error("Failed to fetch chat:", err);
    return c.json({ error: "Failed to fetch chat" }, 500);
  }
});

// Create or update chat
app.post("/", async (c) => {
  const body = await c.req.json<{
    threadId: string;
    owner: string;
    messages: ChatMessage[];
  }>();

  if (!body.threadId || !body.owner || !body.messages) {
    return c.json({ error: "threadId, owner, and messages required" }, 400);
  }

  try {
    const result = await createOrUpdateChat(body.threadId, body.owner, body.messages);
    return c.json(result, 201);
  } catch (err) {
    console.error("Failed to save chat:", err);
    return c.json({ error: "Failed to save chat" }, 500);
  }
});

// Delete chat
app.delete("/:threadId", async (c) => {
  const threadId = c.req.param("threadId");

  try {
    await deleteChat(threadId);
    return c.json({ success: true });
  } catch (err) {
    console.error("Failed to delete chat:", err);
    return c.json({ error: "Failed to delete chat" }, 500);
  }
});

export default app;
