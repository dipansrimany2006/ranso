import { createGroq } from "@ai-sdk/groq";
import {
  streamText,
  type ModelMessage,
  type StreamTextResult,
  type ToolSet,
} from "ai";
import { buildMarketplaceTools } from "./tools.service";
import type { ToolDef } from "../types/ai.types";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful AI assistant for Axicov, a marketplace for AI tools on the Cronos blockchain.

You have access to marketplace tools that users have selected. When a tool is available, USE IT when the user asks to interact with it or test it.

Be concise and helpful. Format responses with markdown when appropriate.`;

export async function createChatStream(
  messages: ModelMessage[],
  selectedTools: ToolDef[],
  onFinish?: (event: { response: { messages: ModelMessage[] } }) => void | Promise<void>
): Promise<StreamTextResult<ToolSet, never>> {
  // Build marketplace tools
  const marketplaceTools = buildMarketplaceTools(selectedTools);

  console.log("[LLM] Starting stream with:", {
    messageCount: messages.length,
    marketplaceToolCount: Object.keys(marketplaceTools).length,
    toolKeys: Object.keys(marketplaceTools),
  });

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: SYSTEM_PROMPT,
    messages,
    tools: Object.keys(marketplaceTools).length > 0 ? marketplaceTools : undefined,
    maxSteps: 10,
    onFinish: (event) => {
      console.log("[LLM] Stream finished");
      onFinish?.(event);
    },
    onChunk: ({ chunk }) => {
      if (chunk.type === "text-delta" && chunk.textDelta) {
        process.stdout.write(chunk.textDelta);
      }
    },
  });

  return result;
}
