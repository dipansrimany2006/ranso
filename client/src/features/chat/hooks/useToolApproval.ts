"use client";

import { useState, useCallback } from "react";
import type { PendingToolCall } from "../types/chat.types";

export function useToolApproval() {
  const [pendingTool, setPendingTool] = useState<PendingToolCall | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const requestApproval = useCallback((toolCall: PendingToolCall) => {
    setPendingTool(toolCall);
  }, []);

  const approve = useCallback(async (): Promise<PendingToolCall | null> => {
    if (!pendingTool) return null;
    const tool = pendingTool;
    setIsProcessing(true);
    setPendingTool(null);
    return tool;
  }, [pendingTool]);

  const reject = useCallback(() => {
    setPendingTool(null);
    setIsProcessing(false);
  }, []);

  const finishProcessing = useCallback(() => {
    setIsProcessing(false);
  }, []);

  return {
    pendingTool,
    isProcessing,
    requestApproval,
    approve,
    reject,
    finishProcessing,
  };
}
