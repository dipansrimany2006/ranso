"use client";

import { useState } from "react";
import {
  IconPlus,
  IconSend,
  IconSettings,
  IconWallet,
  IconChartBar,
} from "@tabler/icons-react";
import Image from "next/image";
import ChatStart from "@/components/cards/chat-start";

const Page = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white px-4">
      <div className="w-full max-w-3xl flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center bg-rose-900 p-2 rounded-xl">
            <Image
              src={"/Large-logo.svg"}
              className=""
              alt="logo"
              height={40}
              width={40}
            />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-neutral-800 mb-8">
          What can I help with?
        </h1>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center gap-2 w-full px-4 py-3 bg-neutral-100 rounded-full border border-neutral-200">
            <button
              type="button"
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors text-neutral-500"
            >
              <IconPlus className="h-5 w-5" />
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

        <div className="grid grid-cols-3 w-full gap-6">
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
        </div>
      </div>
    </div>
  );
};

export default Page;
