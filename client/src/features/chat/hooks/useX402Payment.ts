"use client";

import { useState, useCallback } from "react";
import { useWalletClient } from "wagmi";
import { createPaymentHeader } from "@/lib/facilitator";
import type { PaymentRequest } from "../types/chat.types";

interface PaymentState extends PaymentRequest {
  resolve: (paymentHeader: string | null) => void;
}

export function useX402Payment() {
  const [pendingPayment, setPendingPayment] = useState<PaymentState | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: walletClient } = useWalletClient();

  const requestPayment = useCallback(
    (request: PaymentRequest): Promise<string | null> => {
      return new Promise((resolve) => {
        setPendingPayment({
          ...request,
          resolve,
        });
      });
    },
    []
  );

  const confirmPayment = useCallback(async () => {
    if (!pendingPayment || !walletClient) return;

    setIsProcessing(true);
    try {
      const paymentHeader = await createPaymentHeader(
        pendingPayment.requirements,
        walletClient
      );
      pendingPayment.resolve(paymentHeader);
      setPendingPayment(null);
    } catch (error) {
      console.error("Payment failed:", error);
      pendingPayment.resolve(null);
      setPendingPayment(null);
    } finally {
      setIsProcessing(false);
    }
  }, [pendingPayment, walletClient]);

  const cancelPayment = useCallback(() => {
    if (pendingPayment) {
      pendingPayment.resolve(null);
      setPendingPayment(null);
    }
  }, [pendingPayment]);

  return {
    pendingPayment: pendingPayment
      ? {
          toolId: pendingPayment.toolId,
          toolName: pendingPayment.toolName,
          requirements: pendingPayment.requirements,
        }
      : null,
    isProcessing,
    requestPayment,
    confirmPayment,
    cancelPayment,
  };
}
