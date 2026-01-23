"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconSearch, IconMessage, IconTrash } from "@tabler/icons-react";
import { useAppKitAccount } from "@reown/appkit/react";
import { motion, AnimatePresence } from "motion/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Chat {
  threadId: string;
  owner: string;
  messages: ChatMessage[];
  title: string;
}

const ChatsPage = () => {
  const { address, isConnected } = useAppKitAccount();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isConnected && address) {
      fetchChats();
    } else {
      setChats([]);
    }
  }, [isConnected, address]);

  const fetchChats = async () => {
    if (!address) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/chats/${address}`);
      if (response.ok) {
        const data = await response.json();
        setChats(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (threadId: string) => {
    try {
      await fetch(`${API_URL}/chats/${threadId}`, { method: "DELETE" });
      setChats((prev) => prev.filter((c) => c.threadId !== threadId));
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.messages?.some((m) =>
      m.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getPreview = (messages: ChatMessage[]) => {
    const firstUser = messages?.find((m) => m.role === "user");
    return firstUser?.content?.slice(0, 100) || "No messages";
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2">Chats</h1>
          <p className="text-neutral-500">Your conversation history</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Chats List */}
        <div className="space-y-3">
          {!isConnected ? (
            <div className="text-center py-12 text-neutral-400">
              Connect your wallet to view chats
            </div>
          ) : loading ? (
            <div className="text-center py-12 text-neutral-400">
              Loading chats...
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              {searchQuery ? "No chats match your search" : "No chats yet. Start a new conversation!"}
            </div>
          ) : (
            <AnimatePresence>
              {filteredChats.map((chat, index) => (
                <motion.div
                  key={chat.threadId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link
                    href={`/chat/${chat.threadId}`}
                    className="block bg-neutral-50 border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                        <IconMessage className="h-5 w-5 text-rose-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-neutral-800 truncate mb-1">
                          {chat.title || "New Chat"}
                        </h3>
                        <p className="text-sm text-neutral-500 line-clamp-2">
                          {getPreview(chat.messages)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteChat(chat.threadId);
                        }}
                        className="shrink-0 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-neutral-200 transition-all"
                        title="Delete chat"
                      >
                        <IconTrash className="h-4 w-4 text-neutral-500" />
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
