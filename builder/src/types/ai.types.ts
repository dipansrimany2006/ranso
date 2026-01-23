import type { CoreMessage } from "ai";

export interface ToolDef {
  id: string;
  name: string;
  description: string;
  apiURL: string;
  price: number;
  inputSchema?: object;
  outputSchema?: object;
}

export interface ChatRequest {
  messages: CoreMessage[];
  threadId: string;
  selectedTools: ToolDef[];
  walletAddress: string;
}

export interface ToolExecutionRequest {
  toolId: string;
  input: Record<string, unknown>;
  paymentHeader?: string;
  selectedTools: ToolDef[];
}

export interface PaymentRequiredResult {
  status: "payment_required";
  requirements: Record<string, unknown>;
  toolId: string;
  price: number;
}

export interface ToolSuccessResult {
  status: "success";
  data: unknown;
}

export type ToolExecutionResult = PaymentRequiredResult | ToolSuccessResult;

export interface PendingToolCall {
  toolCallId: string;
  toolId: string;
  input: Record<string, unknown>;
  requirements?: Record<string, unknown>;
}
