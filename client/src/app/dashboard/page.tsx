"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconCopy,
  IconPlus,
  IconTerminal2,
  IconX,
  IconCheck,
  IconAlertCircle,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { useAppKitAccount } from "@reown/appkit/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiKey {
  name: string;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  price: number;
}

const DashboardPage = () => {
  const { address, isConnected } = useAppKitAccount();

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Success modal state - shows the generated key only once
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<{ key: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Local storage for raw keys (key name -> raw key)
  const [localKeys, setLocalKeys] = useState<Record<string, string>>({});
  // Visibility state for each key
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  // Fetch API keys when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      fetchApiKeys();
    } else {
      setApiKeys([]);
    }
  }, [isConnected, address]);

  const fetchApiKeys = async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api-keys/${address}`);
      if (!response.ok) {
        throw new Error("Failed to fetch API keys");
      }
      const data = await response.json();
      setApiKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleKeyVisibility = (keyName: string) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [keyName]: !prev[keyName],
    }));
  };

  const maskKey = (key: string) => {
    return `${key.slice(0, 8)}${"•".repeat(20)}${key.slice(-4)}`;
  };

  const openModal = () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }
    setKeyName("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setKeyName("");
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setGeneratedKey(null);
    setCopied(false);
  };

  const generateApiKey = async () => {
    if (!keyName.trim() || !address) return;

    setIsGenerating(true);

    try {
      const response = await fetch(`${API_URL}/api-keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: address,
          name: keyName.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate API key");
      }

      const data = await response.json();

      // Store the raw key locally so it can be viewed later
      setLocalKeys((prev) => ({
        ...prev,
        [data.name]: data.key,
      }));

      // Show the generated key in success modal (only shown once)
      setGeneratedKey(data);
      setShowSuccessModal(true);

      // Refresh the API keys list
      await fetchApiKeys();

      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate API key");
    } finally {
      setIsGenerating(false);
    }
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
                  disabled={!isConnected}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
                >
                  <IconPlus className="w-4 h-4" />
                  Generate Key
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-sm">
                  <IconAlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* API Keys Table */}
              <div className="flex-1 overflow-hidden rounded-xl border border-neutral-200">
                {/* Table Header */}
                <div className="grid grid-cols-[120px_1fr_100px_80px_100px] bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-600 border-b border-neutral-200">
                  <span>Name</span>
                  <span>Key</span>
                  <span>Date</span>
                  <span>Time</span>
                  <span className="text-right">Action</span>
                </div>

                {/* Table Body */}
                <div className="bg-white divide-y divide-neutral-100">
                  {!isConnected ? (
                    <div className="px-4 py-8 text-center text-neutral-400">
                      Connect your wallet to view API keys
                    </div>
                  ) : loading ? (
                    <div className="px-4 py-8 text-center text-neutral-400">
                      Loading API keys...
                    </div>
                  ) : apiKeys.length === 0 ? (
                    <div className="px-4 py-8 text-center text-neutral-400">
                      No API keys generated yet
                    </div>
                  ) : (
                    apiKeys.map((apiKey, index) => {
                      const rawKey = localKeys[apiKey.name];
                      const isVisible = visibleKeys[apiKey.name];

                      return (
                        <div
                          key={`${apiKey.name}-${index}`}
                          className="grid grid-cols-[120px_1fr_100px_80px_100px] px-4 py-3 items-center text-sm hover:bg-neutral-50 transition-colors"
                        >
                          <span className="text-neutral-800 font-medium truncate">
                            {apiKey.name}
                          </span>
                          <span className="text-neutral-600 font-mono text-xs truncate">
                            {rawKey
                              ? isVisible
                                ? rawKey
                                : maskKey(rawKey)
                              : "••••••••••••••••••••"}
                          </span>
                          <span className="text-neutral-600">
                            {formatDate(apiKey.createdAt)}
                          </span>
                          <span className="text-neutral-500">
                            {formatTime(apiKey.createdAt)}
                          </span>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toggleKeyVisibility(apiKey.name)}
                              disabled={!rawKey}
                              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              title={isVisible ? "Hide key" : "Show key"}
                            >
                              {isVisible ? (
                                <IconEyeOff className="w-4 h-4 text-neutral-500" />
                              ) : (
                                <IconEye className="w-4 h-4 text-neutral-500" />
                              )}
                            </button>
                            <button
                              onClick={() => rawKey && copyToClipboard(rawKey)}
                              disabled={!rawKey}
                              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              title="Copy key"
                            >
                              <IconCopy className="w-4 h-4 text-neutral-500" />
                            </button>
                          </div>
                        </div>
                      );
                    })
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
            onClick={!isGenerating ? closeModal : undefined}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            {/* Close Button */}
            <button
              onClick={closeModal}
              disabled={isGenerating}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50"
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
                disabled={isGenerating}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isGenerating) {
                    generateApiKey();
                  }
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={isGenerating}
                className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={generateApiKey}
                disabled={!keyName.trim() || isGenerating}
                className="px-4 py-2 text-sm font-medium text-white bg-neutral-800 rounded-lg hover:bg-neutral-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? "Generating..." : "Generate Key"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal - Shows generated key only once */}
      {showSuccessModal && generatedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
            {/* Success Icon */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
              <IconCheck className="w-6 h-6 text-green-600" />
            </div>

            {/* Modal Content */}
            <h2 className="text-xl font-semibold text-neutral-800 mb-2 text-center">
              API Key Generated!
            </h2>
            <p className="text-sm text-neutral-500 mb-6 text-center">
              Make sure to copy your API key now. You won&apos;t be able to see it again!
            </p>

            {/* Key Display */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Key Name
              </label>
              <div className="px-4 py-3 bg-neutral-100 rounded-xl text-neutral-800">
                {generatedKey.name}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                API Key
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-3 bg-neutral-900 text-green-400 rounded-xl text-sm font-mono break-all">
                  {generatedKey.key}
                </code>
                <button
                  onClick={() => copyToClipboard(generatedKey.key)}
                  className={`p-3 rounded-xl transition-colors ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-neutral-200 hover:bg-neutral-300 text-neutral-700"
                  }`}
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  {copied ? (
                    <IconCheck className="w-5 h-5" />
                  ) : (
                    <IconCopy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center">
              <button
                onClick={closeSuccessModal}
                className="px-6 py-2 text-sm font-medium text-white bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
              >
                I&apos;ve Saved My Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
