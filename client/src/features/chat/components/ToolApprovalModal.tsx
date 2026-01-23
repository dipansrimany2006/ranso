"use client";

import { motion } from "motion/react";
import { IconTool } from "@tabler/icons-react";
import type { PendingToolCall } from "../types/chat.types";

interface ToolApprovalModalProps {
  toolCall: PendingToolCall;
  onApprove: () => void;
  onReject: () => void;
  isProcessing?: boolean;
}

export function ToolApprovalModal({
  toolCall,
  onApprove,
  onReject,
  isProcessing,
}: ToolApprovalModalProps) {
  const displayName = toolCall.toolName.replace("marketplace_", "");

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <IconTool className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Tool Execution Request</h2>
            <p className="text-sm text-neutral-500">{displayName}</p>
          </div>
        </div>

        <p className="text-neutral-600 mb-4">
          This tool wants to execute with the following input:
        </p>

        <div className="bg-neutral-50 rounded-lg p-3 mb-6 max-h-40 overflow-auto">
          <pre className="text-sm text-neutral-700 whitespace-pre-wrap">
            {JSON.stringify(toolCall.args, null, 2)}
          </pre>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onReject}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            Deny
          </button>
          <button
            onClick={onApprove}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            {isProcessing ? "Executing..." : "Allow"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
