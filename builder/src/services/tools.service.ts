import { tool } from "ai";
import { z } from "zod";
import { jsonSchemaToZod } from "json-schema-to-zod";
import type { ToolDef, ToolExecutionResult } from "../types/ai.types";

function jsonSchemaToZodSchema(jsonSchema: object): z.ZodTypeAny {
  try {
    // jsonSchemaToZod returns a string of Zod code, we eval it
    const zodCode = jsonSchemaToZod(jsonSchema);
    // eslint-disable-next-line no-eval
    return eval(zodCode);
  } catch {
    // Fallback to generic string input
    return z.object({ input: z.string().describe("Input for the tool") });
  }
}

export function createMarketplaceTool(toolDef: ToolDef) {
  // Use inputSchema if available, else fallback to generic
  const parameters = toolDef.inputSchema
    ? jsonSchemaToZodSchema(toolDef.inputSchema)
    : z.object({ input: z.string().describe("Input for the tool") });

  return tool({
    description: `${toolDef.description} (Price: ${toolDef.price} USDC)`,
    parameters,
    // No execute function - requires approval on client side
  });
}

export function buildMarketplaceTools(
  selectedTools: ToolDef[]
): Record<string, ReturnType<typeof tool>> {
  const tools: Record<string, ReturnType<typeof tool>> = {};

  for (const t of selectedTools) {
    // Use sanitized name as key
    const toolKey = `marketplace_${t.id}`;
    tools[toolKey] = createMarketplaceTool(t);
  }

  return tools;
}

export async function executeToolWithPayment(
  toolDef: ToolDef,
  input: Record<string, unknown>,
  paymentHeader?: string
): Promise<ToolExecutionResult> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (paymentHeader) {
    headers["X-PAYMENT"] = paymentHeader;
    console.log("[Tool] Sending with payment header:", paymentHeader.substring(0, 50) + "...");
  }

  try {
    console.log("[Tool] Calling:", toolDef.apiURL + "/send");
    const res = await fetch(`${toolDef.apiURL}/send`, {
      method: "POST",
      headers,
      body: JSON.stringify(input),
    });
    console.log("[Tool] Response status:", res.status);

    if (res.status === 402) {
      const paymentReq = res.headers.get("X-PAYMENT-REQUIRED");
      console.log("[Tool] 402 - X-PAYMENT-REQUIRED header present:", !!paymentReq);
      if (!paymentReq) {
        // Log all headers for debugging
        console.log("[Tool] Response headers:", Object.fromEntries(res.headers.entries()));
        throw new Error("Payment required but no requirements provided");
      }

      const requirements = JSON.parse(
        Buffer.from(paymentReq, "base64").toString()
      );

      return {
        status: "payment_required",
        requirements,
        toolId: toolDef.id,
        price: toolDef.price,
      };
    }

    if (!res.ok) {
      throw new Error(`Tool execution failed: ${res.statusText}`);
    }

    const data = await res.json();
    return { status: "success", data };
  } catch (error) {
    console.error("Tool execution error:", error);
    throw error;
  }
}
