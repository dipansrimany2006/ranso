"use client";

import { IconPlus, IconX, IconSend } from "@tabler/icons-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleTools: () => void;
  showTools: boolean;
  disabled?: boolean;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  onToggleTools,
  showTools,
  disabled,
}: ChatInputProps) {
  return (
    <div className="bg-white pb-4">
      <div className="max-w-3xl mx-auto px-4">
        <form onSubmit={onSubmit}>
          <div className="flex items-center gap-2 w-full px-4 py-3 bg-neutral-100 rounded-full border border-neutral-200">
            <button
              type="button"
              onClick={onToggleTools}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors text-neutral-500"
            >
              {showTools ? (
                <IconX className="h-5 w-5" />
              ) : (
                <IconPlus className="h-5 w-5" />
              )}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything"
              className="flex-1 bg-transparent outline-none text-neutral-800 placeholder:text-neutral-400"
              disabled={disabled}
            />

            <button
              type="submit"
              disabled={!input.trim() || disabled}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors text-white"
            >
              <IconSend className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
