// Hooks
export { useAIChat } from "./hooks/useAIChat";
export { useToolApproval } from "./hooks/useToolApproval";
export { useX402Payment } from "./hooks/useX402Payment";

// Components
export { ChatMessages } from "./components/ChatMessages";
export { ChatInput } from "./components/ChatInput";
export { MessageBubble } from "./components/MessageBubble";
export { ToolCallView } from "./components/ToolCallView";
export { ToolApprovalModal } from "./components/ToolApprovalModal";
export { PaymentModal } from "./components/PaymentModal";

// Types
export type {
  Tool,
  PendingToolCall,
  PaymentRequest,
  ToolExecutionResult,
} from "./types/chat.types";

// Re-export UIMessage from ai for convenience
export type { UIMessage } from "ai";
