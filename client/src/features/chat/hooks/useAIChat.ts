"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Tool, PendingToolCall } from "../types/chat.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface UseAIChatOptions {
  threadId: string;
  selectedTools: Tool[];
  walletAddress?: string;
  initialMessages?: UIMessage[];
  onToolCall?: (toolCall: PendingToolCall) => void;
  onSave?: (messages: UIMessage[]) => void;
}

export function useAIChat({
  threadId,
  selectedTools,
  walletAddress,
  initialMessages,
  onToolCall,
  onSave,
}: UseAIChatOptions) {
  const toolCallHandlerRef = useRef(onToolCall);
  const selectedToolsRef = useRef(selectedTools);
  const walletAddressRef = useRef(walletAddress);
  const threadIdRef = useRef(threadId);

  // Update refs to always have latest values
  useEffect(() => {
    toolCallHandlerRef.current = onToolCall;
  }, [onToolCall]);

  useEffect(() => {
    selectedToolsRef.current = selectedTools;
    console.log("[useAIChat] selectedTools updated:", selectedTools.length, selectedTools.map(t => t.name));
  }, [selectedTools]);

  useEffect(() => {
    walletAddressRef.current = walletAddress;
  }, [walletAddress]);

  useEffect(() => {
    threadIdRef.current = threadId;
  }, [threadId]);

  const [inputValue, setInputValue] = useState("");

  // Use transport with prepareSendMessagesRequest to inject custom data
  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: `${API_URL}/ai/chat`,
        prepareSendMessagesRequest: ({ messages }) => {
          console.log("[Transport] Preparing request with tools:", selectedToolsRef.current.length);
          return {
            body: {
              messages,
              threadId: threadIdRef.current,
              selectedTools: selectedToolsRef.current,
              walletAddress: walletAddressRef.current,
            },
          };
        },
      })
  );

  const chat = useChat({
    id: threadId,
    transport,
    messages: initialMessages,
    onFinish: () => {
      onSave?.(chat.messages);
    },
    onToolCall: ({ toolCall }) => {
      // Check if it's a marketplace tool that needs approval
      if (toolCall.toolName.startsWith("marketplace_")) {
        const toolId = toolCall.toolName.replace("marketplace_", "");
        const toolCallWithArgs = toolCall as { args?: Record<string, unknown> };
        toolCallHandlerRef.current?.({
          id: toolCall.toolCallId,
          toolName: toolCall.toolName,
          toolId,
          args: toolCallWithArgs.args || {},
        });
      }
    },
  });

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault?.();
      if (!inputValue.trim()) return;

      chat.sendMessage({ text: inputValue });
      setInputValue("");
    },
    [inputValue, chat]
  );

  const addToolResult = useCallback(
    ({ toolCallId, toolName, result }: { toolCallId: string; toolName: string; result: unknown }) => {
      chat.addToolResult({ toolCallId, tool: toolName, output: result });
    },
    [chat]
  );

  const append = useCallback(
    (message: { role: "user" | "assistant"; content: string }) => {
      if (message.role === "user") {
        chat.sendMessage({ text: message.content });
      }
    },
    [chat]
  );

  return {
    messages: chat.messages,
    input: inputValue,
    setInput: setInputValue,
    handleSubmit,
    status: chat.status,
    error: chat.error,
    isLoading: chat.status === "streaming" || chat.status === "submitted",
    reload: chat.regenerate,
    stop: chat.stop,
    addToolResult,
    append,
  };
}
