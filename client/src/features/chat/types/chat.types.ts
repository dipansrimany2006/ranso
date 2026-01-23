export interface Tool {
  id: string;
  owner: string;
  name: string;
  description: string;
  apiURL: string;
  images: string[];
  price: number;
}

export interface PendingToolCall {
  id: string;
  toolName: string;
  toolId: string;
  args: Record<string, unknown>;
}

export interface PaymentRequest {
  toolId: string;
  toolName: string;
  requirements: { payTo: string; maxAmountRequired: string };
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
