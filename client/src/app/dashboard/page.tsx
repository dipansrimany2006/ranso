"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconCopy,
  IconTrash,
  IconPlus,
  IconTerminal2,
  IconX,
} from "@tabler/icons-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
}

interface Project {
  id: string;
  name: string;
  description: string;
  price: number;
}

const DashboardPage = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production Key",
      key: "0xAxi6a3f8b2c4d1e5a7b9c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0402f1",
      createdAt: new Date("2025-11-29T20:37:00"),
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");

  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Image Generator",
      description: "AI-powered image generation tool",
      price: 29.99,
    },
    {
      id: "2",
      name: "Text Analyzer",
      description: "NLP text analysis service",
      price: 19.99,
    },
    {
      id: "3",
      name: "Code Assistant",
      description: "AI code completion helper",
      price: 49.99,
    },
  ]);

  const totalEarned = 120;
  const totalProjects = projects.length;

  const truncateKey = (key: string) => {
    if (key.length <= 16) return key;
    return `${key.slice(0, 10)}...............${key.slice(-5)}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  const openModal = () => {
    setKeyName("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setKeyName("");
  };

  const generateApiKey = () => {
    if (!keyName.trim()) return;

    const newKey = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;
    const newApiKey: ApiKey = {
      id: Date.now().toString(),
      name: keyName.trim(),
      key: newKey,
      createdAt: new Date(),
    };
    setApiKeys([...apiKeys, newApiKey]);
    closeModal();
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="h-full p-6">
        {/* Bento Grid Layout */}
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats and API Keys */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-6">
              {/* Total Earned Card */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 flex flex-col">
                <span className="text-sm text-neutral-500 mb-2">
                  Total Earned
                </span>
                <span className="text-4xl font-bold text-neutral-800">
                  ${totalEarned}
                </span>
              </div>

              {/* No of Projects Card */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 flex flex-col">
                <span className="text-sm text-neutral-500 mb-2">
                  No of Projects
                </span>
                <span className="text-4xl font-bold text-neutral-800">
                  {totalProjects}
                </span>
              </div>
            </div>

            {/* API Keys Section */}
            <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-2xl p-6 flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-800">
                  API Keys
                </h2>
                <button
                  onClick={openModal}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  <IconPlus className="w-4 h-4" />
                  Generate Key
                </button>
              </div>

              {/* API Keys Table */}
              <div className="flex-1 overflow-hidden rounded-xl border border-neutral-200">
                {/* Table Header */}
                <div className="grid grid-cols-[120px_1fr_120px_80px_100px] bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-600 border-b border-neutral-200">
                  <span>Name</span>
                  <span>Key</span>
                  <span>Date</span>
                  <span>Time</span>
                  <span className="text-right">Action</span>
                </div>

                {/* Table Body */}
                <div className="bg-white divide-y divide-neutral-100">
                  {apiKeys.length === 0 ? (
                    <div className="px-4 py-8 text-center text-neutral-400">
                      No API keys generated yet
                    </div>
                  ) : (
                    apiKeys.map((apiKey) => (
                      <div
                        key={apiKey.id}
                        className="grid grid-cols-[120px_1fr_120px_80px_100px] px-4 py-3 items-center text-sm hover:bg-neutral-50 transition-colors"
                      >
                        <span className="text-neutral-800 font-medium truncate">
                          {apiKey.name}
                        </span>
                        <span className="text-neutral-700 font-mono">
                          {truncateKey(apiKey.key)}
                        </span>
                        <span className="text-neutral-600">
                          {formatDate(apiKey.createdAt)}
                        </span>
                        <span className="text-neutral-500">
                          {formatTime(apiKey.createdAt)}
                        </span>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => copyToClipboard(apiKey.key)}
                            className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
                            title="Copy key"
                          >
                            <IconCopy className="w-4 h-4 text-neutral-500" />
                          </button>
                          <button
                            onClick={() => deleteApiKey(apiKey.id)}
                            className="p-2 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors"
                            title="Delete key"
                          >
                            <IconTrash className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Projects */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 flex flex-col min-h-[400px] lg:min-h-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-800">
                Projects
              </h2>
              <Link
                href="/explore"
                className="text-sm text-rose-600 hover:text-rose-500 transition-colors"
              >
                View All
              </Link>
            </div>

            {/* Projects List */}
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
              {projects.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-neutral-400">
                  No projects yet
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-neutral-800">
                        {project.name}
                      </h3>
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center bg-rose-600">
                        <IconTerminal2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-sm text-neutral-500 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <span className="text-sm font-medium text-rose-600">
                      ${project.price.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Generate API Key Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
              title="Close modal"
            >
              <IconX className="w-5 h-5 text-neutral-500" />
            </button>

            {/* Modal Content */}
            <h2 className="text-xl font-semibold text-neutral-800 mb-2">
              Generate New API Key
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Enter a name for your API key to help you identify it later.
            </p>

            {/* Input */}
            <div className="mb-6">
              <label
                htmlFor="keyName"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Key Name
              </label>
              <input
                type="text"
                id="keyName"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g., Production, Development, Testing"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    generateApiKey();
                  }
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={generateApiKey}
                disabled={!keyName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-neutral-800 rounded-lg hover:bg-neutral-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
              >
                Generate Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
