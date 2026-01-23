"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "motion/react";
import {
  IconPlus,
  IconX,
  IconSend,
  IconSettings,
  IconWallet,
  IconChartBar,
} from "@tabler/icons-react";
import Image from "next/image";
import ChatStart from "@/components/cards/chat-start";
import ChatLayout from "@/components/layout/ChatLayout";

interface Tool {
  id: string;
  owner: string;
  name: string;
  description: string;
  apiURL: string;
  images: string[];
  price: number;
}

const Page = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [showTools, setShowTools] = useState(false);
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const handleSelectTool = (tool: Tool) => {
    setSelectedTools((prev) =>
      prev.some((t) => t.id === tool.id)
        ? prev.filter((t) => t.id !== tool.id)
        : [...prev, tool]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isTransitioning) {
      // Save selected tools to localStorage for chat page
      if (selectedTools.length > 0) {
        localStorage.setItem("pendingTools", JSON.stringify(selectedTools));
      }
      // Generate chat ID and start transition
      const chatId = uuidv4();
      setPendingNavigation(`/chat/${chatId}?initial=${encodeURIComponent(message.trim())}`);
      setIsTransitioning(true);
    }
  };

  const handleAnimationComplete = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  return (
    <ChatLayout
      showTools={showTools}
      selectedTools={selectedTools}
      onSelectTool={handleSelectTool}
    >
      <div className="flex flex-col h-full bg-white px-4 relative">
        {/* Centered content that fades out */}
        <AnimatePresence mode="wait" onExitComplete={handleAnimationComplete}>
          {!isTransitioning && (
            <motion.div
              key="home-content"
              className="flex-1 flex flex-col items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="w-full max-w-3xl flex flex-col items-center justify-center space-y-6">
                <motion.div
                  className="flex items-center justify-center"
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-center bg-rose-900 p-2 rounded-xl">
                    <Image
                      src={"/Large-logo.svg"}
                      alt="logo"
                      height={40}
                      width={40}
                    />
                  </div>
                </motion.div>

                <motion.h1
                  className="text-2xl font-semibold text-neutral-800 mb-8"
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                >
                  What can I help with?
                </motion.h1>

                <form onSubmit={handleSubmit} className="w-full">
                  <div className="flex items-center gap-2 w-full px-4 py-3 bg-neutral-100 rounded-full border border-neutral-200">
                    <button
                      type="button"
                      onClick={() => setShowTools(!showTools)}
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors text-neutral-500"
                    >
                      {showTools ? (
                        <IconX className="h-5 w-5" />
                      ) : (
                        <IconPlus className="h-5 w-5" />
                      )}
                    </button>

                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask anything"
                      className="flex-1 bg-transparent outline-none text-neutral-800 placeholder:text-neutral-400"
                    />

                    <button
                      type="submit"
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors text-white"
                    >
                      <IconSend className="h-4 w-4" />
                    </button>
                  </div>
                </form>

                <motion.div
                  className="grid grid-cols-3 w-full gap-6"
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <ChatStart
                    icon={<IconSettings className="w-6 h-6 text-neutral-500" />}
                    title="Blockchain"
                    description="Make blockchain interactions with the agent"
                  />
                  <ChatStart
                    icon={<IconWallet className="w-6 h-6 text-neutral-500" />}
                    title="Wallet"
                    description="Manage your crypto wallets and balances"
                  />
                  <ChatStart
                    icon={<IconChartBar className="w-6 h-6 text-neutral-500" />}
                    title="Analytics"
                    description="Track and analyze your portfolio performance"
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state during transition */}
        {isTransitioning && (
          <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}
      </div>
    </ChatLayout>
  );
};

export default Page;
