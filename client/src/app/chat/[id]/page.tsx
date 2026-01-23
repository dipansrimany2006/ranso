"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAppKitAccount } from "@reown/appkit/react";

import ChatLayout from "@/components/layout/ChatLayout";
import {
  useAIChat,
  useToolApproval,
  useX402Payment,
  ChatMessages,
  ChatInput,
  ToolApprovalModal,
  PaymentModal,
  type Tool,
  type ToolExecutionResult,
} from "@/features/chat";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { address, isConnected } = useAppKitAccount();
  const threadId = params.id as string;

  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [showTools, setShowTools] = useState(false);
  const [chatLoaded, setChatLoaded] = useState(false);
  const initialProcessed = useRef(false);

  // Tool approval flow
  const {
    pendingTool,
    isProcessing: isToolProcessing,
    requestApproval,
    approve,
    reject,
    finishProcessing,
  } = useToolApproval();

  // Payment flow
  const {
    pendingPayment,
    isProcessing: isPaymentProcessing,
    requestPayment,
    confirmPayment,
    cancelPayment,
  } = useX402Payment();

  // AI Chat
  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    error,
    addToolResult,
    append,
  } = useAIChat({
    threadId,
    selectedTools,
    walletAddress: address,
    onToolCall: requestApproval,
    onSave: async (msgs) => {
      // Messages are persisted server-side via onFinish in the stream
      window.dispatchEvent(new CustomEvent("chat-updated"));
    },
  });

  // Handle tool approval and execution
  const handleApprove = useCallback(async () => {
    const tool = await approve();
    if (!tool) return;

    try {
      // Execute the tool
      const res = await fetch(`${API_URL}/ai/execute-tool`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: tool.toolId,
          input: tool.args,
          selectedTools,
        }),
      });

      const result: ToolExecutionResult = await res.json();

      if (result.status === "payment_required") {
        // Request payment
        const toolDef = selectedTools.find((t) => t.id === tool.toolId);
        const paymentHeader = await requestPayment({
          toolId: tool.toolId,
          toolName: toolDef?.name || tool.toolName,
          requirements: result.requirements as {
            payTo: string;
            maxAmountRequired: string;
          },
        });

        if (paymentHeader) {
          // Retry with payment
          try {
            const paidRes = await fetch(`${API_URL}/ai/execute-tool`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                toolId: tool.toolId,
                input: tool.args,
                paymentHeader,
                selectedTools,
              }),
            });
            const paidResult: ToolExecutionResult = await paidRes.json();

            if (paidResult.status === "success") {
              addToolResult({ toolCallId: tool.id, toolName: tool.toolName, result: paidResult.data });
            } else {
              addToolResult({
                toolCallId: tool.id,
                toolName: tool.toolName,
                result: { error: "Payment failed" },
              });
            }
          } catch (paidErr) {
            console.error("Paid request error:", paidErr);
            addToolResult({
              toolCallId: tool.id,
              toolName: tool.toolName,
              result: { error: "Payment execution failed" },
            });
          }
        } else {
          addToolResult({
            toolCallId: tool.id,
            toolName: tool.toolName,
            result: { error: "Payment cancelled" },
          });
        }
      } else if (result.status === "success") {
        addToolResult({ toolCallId: tool.id, toolName: tool.toolName, result: result.data });
      } else {
        // Unknown status or error
        addToolResult({
          toolCallId: tool.id,
          toolName: tool.toolName,
          result: { error: "Tool execution returned unexpected status" },
        });
      }
    } catch (err) {
      console.error("Tool execution error:", err);
      addToolResult({
        toolCallId: tool.id,
        toolName: tool.toolName,
        result: { error: "Tool execution failed" },
      });
    } finally {
      finishProcessing();
    }
  }, [
    approve,
    selectedTools,
    requestPayment,
    addToolResult,
    finishProcessing,
  ]);

  // Handle tool rejection
  const handleReject = useCallback(() => {
    if (pendingTool) {
      addToolResult({
        toolCallId: pendingTool.id,
        toolName: pendingTool.toolName,
        result: { error: "Tool execution denied by user" },
      });
    }
    reject();
  }, [pendingTool, addToolResult, reject]);

  // Load pending tools from localStorage (from home page)
  useEffect(() => {
    if (initialProcessed.current) return;

    const pending = localStorage.getItem("pendingTools");
    if (pending) {
      try {
        setSelectedTools(JSON.parse(pending));
      } catch (e) {
        console.error("Failed to parse pending tools:", e);
      }
      localStorage.removeItem("pendingTools");
    }
    initialProcessed.current = true;
  }, []);

  // Handle initial message from home page
  useEffect(() => {
    if (!chatLoaded) {
      setChatLoaded(true);
      return;
    }

    const initialMessage = searchParams.get("initial");
    if (initialMessage && messages.length === 0) {
      // Send the initial message
      append({
        role: "user",
        content: initialMessage,
      });
      // Clean URL
      router.replace(`/chat/${threadId}`, { scroll: false });
    }
  }, [searchParams, chatLoaded, messages.length, append, router, threadId]);

  // Tool selection handler
  const handleSelectTool = useCallback((tool: Tool) => {
    setSelectedTools((prev) =>
      prev.some((t) => t.id === tool.id)
        ? prev.filter((t) => t.id !== tool.id)
        : [...prev, tool]
    );
  }, []);

  return (
    <ChatLayout
      showTools={showTools}
      selectedTools={selectedTools}
      onSelectTool={handleSelectTool}
    >
      <motion.div
        className="flex flex-col h-full bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Error display */}
        {error && (
          <div className="mx-auto max-w-3xl px-4 py-2">
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">
              Something went wrong. Please try again.
            </div>
          </div>
        )}

        {/* Messages */}
        <ChatMessages messages={messages} isLoading={isLoading} />

        {/* Input */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          onToggleTools={() => setShowTools(!showTools)}
          showTools={showTools}
          disabled={isLoading}
        />
      </motion.div>

      {/* Tool Approval Modal */}
      <AnimatePresence>
        {pendingTool && (
          <ToolApprovalModal
            toolCall={pendingTool}
            onApprove={handleApprove}
            onReject={handleReject}
            isProcessing={isToolProcessing}
          />
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {pendingPayment && (
          <PaymentModal
            payment={pendingPayment}
            onConfirm={confirmPayment}
            onCancel={cancelPayment}
            isProcessing={isPaymentProcessing}
          />
        )}
      </AnimatePresence>
    </ChatLayout>
  );
}
