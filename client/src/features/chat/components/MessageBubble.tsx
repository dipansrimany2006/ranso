"use client";

import { ToolCallView } from "./ToolCallView";
import type { UIMessage } from "ai";

interface ToolInvocationPart {
  type: "tool-invocation";
  toolName: string;
  toolCallId: string;
  state: "partial-call" | "call" | "result";
  args?: Record<string, unknown>;
  output?: unknown;
}

interface MessageBubbleProps {
  message: UIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === "user") {
    // Get text from parts
    const textContent = message.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("\n");

    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-[80%] px-4 py-3 bg-neutral-800 text-white rounded-2xl rounded-tr-sm">
          <p className="whitespace-pre-wrap">{textContent}</p>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="mb-6 text-neutral-700 leading-relaxed">
      {message.parts?.map((part, i) => {
        if (part.type === "tool-invocation") {
          return <ToolCallView key={i} invocation={part as ToolInvocationPart} />;
        }
        if (part.type === "text") {
          return (
            <div key={i} className="prose prose-neutral max-w-none">
              {renderContent(part.text)}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function renderContent(content: string) {
  if (!content) return null;

  const lines = content.split("\n");
  return lines.map((line, index) => {
    // Headers
    if (line.startsWith("## ")) {
      return (
        <h2
          key={index}
          className="text-lg font-semibold text-neutral-800 mt-6 mb-2"
        >
          {line.replace("## ", "")}
        </h2>
      );
    }
    if (line.startsWith("# ")) {
      return (
        <h1
          key={index}
          className="text-xl font-bold text-neutral-800 mt-6 mb-2"
        >
          {line.replace("# ", "")}
        </h1>
      );
    }
    // Horizontal rule
    if (line === "---") {
      return <hr key={index} className="border-neutral-200 my-4" />;
    }
    // Bullet points
    if (line.startsWith("- ")) {
      const text = line.replace("- ", "");
      return (
        <div key={index} className="flex items-start gap-2 my-1">
          <span className="text-green-500 mt-0.5">•</span>
          <span>{renderInlineFormatting(text)}</span>
        </div>
      );
    }
    // Code blocks
    if (line.startsWith("```")) {
      return null; // Simplified - would need multi-line handling
    }
    // Empty lines
    if (line.trim() === "") {
      return <div key={index} className="h-2" />;
    }
    // Regular paragraph
    return (
      <p key={index} className="my-1">
        {renderInlineFormatting(line)}
      </p>
    );
  });
}

function renderInlineFormatting(text: string) {
  // Handle bold (**text**) and inline code (`code`)
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="bg-neutral-100 px-1 py-0.5 rounded text-sm font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
