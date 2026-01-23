"use client";

import { useState } from "react";
import { IconPlus, IconMicrophone, IconWaveSine } from "@tabler/icons-react";

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
      <h1 className="text-2xl font-semibold text-neutral-800 mb-8">
        What can I help with?
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="flex items-center gap-2 w-full px-4 py-3 bg-neutral-100 rounded-full border border-neutral-200">
          <button
            type="button"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors text-neutral-500"
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
            type="button"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors text-neutral-500"
          >
            <IconMicrophone className="h-5 w-5" />
          </button>

          <button
            type="submit"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors text-white"
          >
            <IconWaveSine className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
