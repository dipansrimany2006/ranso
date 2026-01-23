import type { Context } from "hono";
import { createChatStream } from "../services/llm.service";
import { executeToolWithPayment } from "../services/tools.service";
import { db } from "../db";
import { chats } from "../db/schema";
import { eq } from "drizzle-orm";
import type {
  ChatRequest,
  ToolExecutionRequest,
  ToolDef,
} from "../types/ai.types";
import type { ModelMessage } from "ai";

// Convert various message formats to ModelMessage
function normalizeMessages(messages: unknown[]): ModelMessage[] {
  return messages.map((msg) => {
    const m = msg as Record<string, unknown>;

    // Handle UIMessage format (with parts array)
    if (m.parts && Array.isArray(m.parts)) {
      const textPart = (m.parts as Array<{ type: string; text?: string }>).find(
        (p) => p.type === "text"
      );
      return {
        role: m.role as "user" | "assistant",
        content: textPart?.text || "",
      };
    }

    // Handle CoreMessage format (with content string)
    return {
      role: m.role as "user" | "assistant",
      content: (m.content as string) || "",
    };
  });
}

export async function handleChat(c: Context) {
  console.log("[AI] Chat request received");

  try {
    const body = await c.req.json<ChatRequest>();
    const { messages, threadId, selectedTools, walletAddress } = body;

    console.log("[AI] Request:", {
      threadId,
      messageCount: messages?.length,
      toolCount: selectedTools?.length,
      toolNames: selectedTools?.map((t: ToolDef) => t.name) || [],
      walletAddress: walletAddress?.slice(0, 10) + "...",
    });

    if (!messages || !threadId) {
      console.log("[AI] Missing required fields");
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Load existing chat history
    console.log("[AI] Loading chat history...");
    const existing = await db
      .select()
      .from(chats)
      .where(eq(chats.threadId, threadId));

    const history = existing[0]?.chats || [];
    console.log("[AI] History loaded:", history.length, "messages");

    // Normalize all messages to CoreMessage format
    const normalizedHistory = normalizeMessages(history);
    const normalizedNew = normalizeMessages(messages);
    const allMessages = [...normalizedHistory, ...normalizedNew];

    // Create stream
    console.log("[AI] Creating chat stream...");
    const result = await createChatStream(
      allMessages,
      selectedTools || [],
      async ({ response }) => {
        console.log("[AI] Stream finished, persisting messages...");
        try {
          const updatedMessages = [...allMessages, ...response.messages];

          if (existing.length > 0) {
            await db
              .update(chats)
              .set({ chats: updatedMessages })
              .where(eq(chats.threadId, threadId));
          } else {
            await db.insert(chats).values({
              threadId,
              owner: walletAddress || "",
              chats: updatedMessages,
            });
          }
          console.log("[AI] Messages persisted successfully");
        } catch (err) {
          console.error("[AI] Failed to persist chat:", err);
        }
      }
    );

    console.log("[AI] Returning stream response...");
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[AI] Chat handler error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}

export async function handleToolExecution(c: Context) {
  console.log("[AI] Tool execution request received");

  try {
    const body = await c.req.json<ToolExecutionRequest>();
    const { toolId, input, paymentHeader, selectedTools } = body;

    console.log("[AI] Tool execution:", { toolId, hasPayment: !!paymentHeader });

    if (!toolId || !selectedTools) {
      console.log("[AI] Missing required fields for tool execution");
      return c.json({ error: "Missing required fields" }, 400);
    }

    const toolDef = selectedTools.find((t: ToolDef) => t.id === toolId);
    if (!toolDef) {
      console.log("[AI] Tool not found:", toolId);
      return c.json({ error: "Tool not found" }, 404);
    }

    console.log("[AI] Executing tool:", toolDef.name);
    const result = await executeToolWithPayment(toolDef, input, paymentHeader);
    console.log("[AI] Tool execution result:", result.status);

    return c.json(result);
  } catch (error) {
    console.error("[AI] Tool execution error:", error);
    return c.json({ error: "Tool execution failed" }, 500);
  }
}
