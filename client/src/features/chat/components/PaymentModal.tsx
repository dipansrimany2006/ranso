"use client";

import { motion } from "motion/react";
import { IconCurrencyDollar, IconWallet } from "@tabler/icons-react";
import { formatUnits } from "viem";
import type { PaymentRequest } from "../types/chat.types";

interface PaymentModalProps {
  payment: PaymentRequest;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export function PaymentModal({
  payment,
  onConfirm,
  onCancel,
  isProcessing,
}: PaymentModalProps) {
  const displayName = payment.toolName.replace("marketplace_", "");
  const price = formatUnits(BigInt(payment.requirements.maxAmountRequired), 6);

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
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <IconCurrencyDollar className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Payment Required</h2>
            <p className="text-sm text-neutral-500">{displayName}</p>
          </div>
        </div>

        <p className="text-neutral-600 mb-4">
          This tool requires payment to continue execution.
        </p>

        <div className="bg-neutral-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-neutral-600">
              <IconWallet className="h-4 w-4" />
              <span>Amount</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-semibold">{price}</span>
              <span className="text-neutral-500 ml-1">USDC</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-neutral-500 mb-6">
          Payment will be processed on Cronos Testnet. By confirming, you agree
          to pay for this tool execution.
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Pay & Continue"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
