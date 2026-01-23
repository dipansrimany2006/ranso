"use client";

import { IconTool, IconCheck, IconLoader2, IconAlertCircle } from "@tabler/icons-react";

interface ToolInvocation {
  type: "tool-invocation";
  toolName: string;
  toolCallId: string;
  state: "partial-call" | "call" | "result";
  args?: Record<string, unknown>;
  output?: unknown;
}

interface ToolCallViewProps {
  invocation: ToolInvocation;
}

export function ToolCallView({ invocation }: ToolCallViewProps) {
  const { toolName, state, args, output } = invocation;
  const isMarketplace = toolName.startsWith("marketplace_");
  const displayName = isMarketplace
    ? toolName.replace("marketplace_", "")
    : toolName;

  const outputObj = output as Record<string, unknown> | null | undefined;
  const isPaymentRequired = outputObj?.status === "payment_required";
  const isError = outputObj?.error !== undefined;

  return (
    <div className="border border-neutral-200 rounded-lg p-4 my-3 bg-neutral-50">
      <div className="flex items-center gap-2">
        <IconTool className="h-4 w-4 text-neutral-500" />
        <span className="font-medium text-sm">{displayName}</span>
        {isMarketplace && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            Marketplace
          </span>
        )}
        {state === "call" && (
          <IconLoader2 className="h-4 w-4 animate-spin text-neutral-400" />
        )}
        {state === "result" && !isPaymentRequired && !isError && (
          <IconCheck className="h-4 w-4 text-green-500" />
        )}
        {isPaymentRequired && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            Payment Required
          </span>
        )}
        {isError && (
          <IconAlertCircle className="h-4 w-4 text-red-500" />
        )}
      </div>

      {args && Object.keys(args).length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-neutral-500 mb-1">Input:</p>
          <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
            {JSON.stringify(args, null, 2)}
          </pre>
        </div>
      )}

      {state === "result" && output !== undefined && output !== null && !isPaymentRequired ? (
        <div className="mt-2">
          <p className="text-xs text-neutral-500 mb-1">Result:</p>
          <pre className="text-xs bg-white p-2 rounded border overflow-x-auto max-h-40">
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
