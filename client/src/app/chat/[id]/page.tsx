"use client";

import { useState, useRef, useEffect } from "react";
import { IconPlus, IconMicrophone, IconWaveSine } from "@tabler/icons-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "I am making a permissionless prediction market place for mantle hackathon. I already made the basic MVP of the prediction market place, Now to win the hackathon what things need to be add in the platform.",
    },
    {
      id: "2",
      role: "assistant",
      content: `Here's a **tailored plan** to help your permissionless prediction marketplace stand out and **win a prize at the Mantle Global Hackathon 2025** — based on the official hackathon details, tracks, judges, and judging criteria.

---

## What the Mantle Hackathon Is Looking For

According to the hackathon rules, prizes, and judging criteria:

**Key evaluation pillars include:**
- Technical excellence (working & scalable code)
- User experience (UX) & smooth demos
- Real-world applicability and utility
- Integration with Mantle's stack & ecosystem
- Long-term potential & ecosystem fit
- Community support (community vote prizes)
- Optional incubation potential post-hackathon

**Prize breakdown** highlights that *Best UX/Demo*, *Best Mantle Integration*, and *Community Choice* awards are separate from track prizes — meaning **demonstration, polish, and visibility matter almost as much as the product itself**.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a simulated response. The actual AI integration will be implemented later.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const renderMessageContent = (content: string) => {
    // Simple markdown-like rendering
    const lines = content.split("\n");
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-lg font-semibold text-neutral-800 mt-6 mb-2 flex items-center gap-2">
            {line.replace("## ", "")}
          </h2>
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
            <span className="text-green-500 mt-0.5">✓</span>
            <span>{renderInlineFormatting(text)}</span>
          </div>
        );
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
  };

  const renderInlineFormatting = (text: string) => {
    // Handle bold (**text**) and italic (*text*)
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.map((message) => (
            <div key={message.id} className="mb-6">
              {message.role === "user" ? (
                // User message - right aligned with dark bubble
                <div className="flex justify-end">
                  <div className="max-w-[80%] px-4 py-3 bg-neutral-800 text-white rounded-2xl rounded-tr-sm">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ) : (
                // Assistant message - left aligned, plain text
                <div className="text-neutral-700 leading-relaxed">
                  {renderMessageContent(message.content)}
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="mb-6">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white pb-4">
        <div className="max-w-3xl mx-auto px-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 w-full px-4 py-3 bg-neutral-100 rounded-full border border-neutral-200">
              <button
                type="button"
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors text-neutral-500"
              >
                <IconPlus className="h-5 w-5" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything"
                className="flex-1 bg-transparent outline-none text-neutral-800 placeholder:text-neutral-400"
                disabled={isLoading}
              />

              <button
                type="button"
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors text-neutral-500"
              >
                <IconMicrophone className="h-5 w-5" />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors text-white"
              >
                <IconWaveSine className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
