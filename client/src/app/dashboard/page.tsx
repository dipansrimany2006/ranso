"use client";

import { useState, useEffect } from "react";
import {
  IconCopy,
  IconPlus,
  IconX,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconWallet,
  IconReceipt,
  IconKey,
} from "@tabler/icons-react";
import Image from "next/image";
import { useAppKitAccount } from "@reown/appkit/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiKey {
  name: string;
  createdAt: string;
}

const DashboardPage = () => {
  const { address, isConnected } = useAppKitAccount();

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<{
    key: string;
    name: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const [localKeys, setLocalKeys] = useState<Record<string, string>>({});
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

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

  const totalEarned = 120;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
    return `${key.slice(0, 8)}${"•".repeat(16)}${key.slice(-4)}`;
  };

  const truncateAddress = (addr: string) => {
    if (!addr || addr.length <= 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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

      setLocalKeys((prev) => ({
        ...prev,
        [data.name]: data.key,
      }));

      setGeneratedKey(data);
      setShowSuccessModal(true);

      await fetchApiKeys();

      closeModal();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate API key",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-normal text-neutral-900 mb-2">
            Dashboard
          </h1>
          <p className="text-neutral-500">
            Manage your keys and track earnings
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-12 mb-12 pb-8 border-b border-neutral-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
              <IconWallet className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Connected</p>
              <p className="text-base font-medium text-neutral-900">
                {isConnected ? truncateAddress(address || "") : "Not connected"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
              <IconReceipt className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Total Earned</p>
              <p className="text-base font-medium text-neutral-900">$0</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
              <IconKey className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">API Keys</p>
              <p className="text-base font-medium text-neutral-900">
                {apiKeys.length}
              </p>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider">
              API Keys
            </h2>
            <button
              onClick={openModal}
              disabled={!isConnected}
              className="flex items-center gap-2 text-sm  disabled:text-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              <IconPlus className="w-4 h-4" />
              New key
            </button>
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          {!isConnected ? (
            <p className="text-neutral-400 py-8">
              Connect your wallet to manage API keys.
            </p>
          ) : loading ? (
            <p className="text-neutral-400 py-8">Loading...</p>
          ) : apiKeys.length === 0 ? (
            <p className="text-neutral-400 py-8">
              No API keys yet. Create one to get started.
            </p>
          ) : (
            <div className="space-y-1">
              {apiKeys.map((apiKey, index) => {
                const rawKey = localKeys[apiKey.name];
                const isVisible = visibleKeys[apiKey.name];

                return (
                  <div
                    key={`${apiKey.name}-${index}`}
                    className="group flex items-center gap-6 py-4 border-b border-neutral-100 -mx-4 px-4 hover:bg-neutral-50 transition-colors"
                  >
                    {/* Number */}
                    <span className="w-8 text-sm text-neutral-700 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <IconKey className="w-5 h-5 text-neutral-500" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-neutral-900">
                        {apiKey.name}
                      </h3>
                    </div>

                    {/* Meta */}
                    <span className="hidden sm:block text-sm text-neutral-400">
                      {formatDate(apiKey.createdAt)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => rawKey && copyToClipboard(rawKey)}
                        disabled={!rawKey}
                        className="p-2 text-neutral-400 hover:text-neutral-600 disabled:text-neutral-200 transition-colors"
                      >
                        <IconCopy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Generate API Key Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={!isGenerating ? closeModal : undefined}
          />

          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-8">
            <button
              onClick={closeModal}
              disabled={isGenerating}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50"
            >
              <IconX className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-normal text-neutral-900 mb-2">
              New API Key
            </h2>
            <p className="text-neutral-500 mb-8">
              Give your key a name to identify it later.
            </p>

            <input
              type="text"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="Key name"
              className="w-full px-0 py-3 text-lg border-b border-neutral-200 bg-transparent placeholder-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors mb-8"
              autoFocus
              disabled={isGenerating}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isGenerating) {
                  generateApiKey();
                }
              }}
            />

            <div className="flex items-center justify-end gap-4">
              <button
                onClick={closeModal}
                disabled={isGenerating}
                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={generateApiKey}
                disabled={!keyName.trim() || isGenerating}
                className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:bg-neutral-200 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? "Creating..." : "Create key"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && generatedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-8">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-6 bg-green-100 rounded-full">
              <IconCheck className="w-6 h-6 text-green-600" />
            </div>

            <h2 className="text-2xl font-normal text-neutral-900 mb-2 text-center">
              Key created
            </h2>
            <p className="text-neutral-500 mb-8 text-center">
              Copy your key now. You won&apos;t see it again.
            </p>

            <div className="mb-8">
              <p className="text-sm text-neutral-400 mb-2">
                {generatedKey.name}
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-3 bg-neutral-900 text-green-400 rounded-lg text-sm font-mono break-all">
                  {generatedKey.key}
                </code>
                <button
                  onClick={() => copyToClipboard(generatedKey.key)}
                  className={`p-3 rounded-lg transition-colors ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {copied ? (
                    <IconCheck className="w-5 h-5" />
                  ) : (
                    <IconCopy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={closeSuccessModal}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
