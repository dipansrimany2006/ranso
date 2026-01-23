"use client";

import { useState } from "react";
import {
  IconWallet,
  IconBell,
  IconPalette,
  IconShield,
  IconExternalLink,
  IconCheck,
} from "@tabler/icons-react";
import { useAppKitAccount } from "@reown/appkit/react";

const SettingsPage = () => {
  const { address, isConnected } = useAppKitAccount();
  const [notifications, setNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [saved, setSaved] = useState(false);

  const truncateAddress = (addr: string) => {
    if (!addr || addr.length <= 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-normal text-neutral-900 mb-2">
            Settings
          </h1>
          <p className="text-neutral-500">
            Manage your account preferences
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {/* Wallet Section */}
          <section>
            <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-6">
              Wallet
            </h2>
            <div className="space-y-1">
              <div className="flex items-center gap-6 py-4 border-b border-neutral-100 -mx-4 px-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <IconWallet className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-neutral-900">
                    Connected Wallet
                  </h3>
                  <p className="text-sm text-neutral-400">
                    {isConnected ? truncateAddress(address || "") : "No wallet connected"}
                  </p>
                </div>
                {isConnected && (
                  <a
                    href={`https://testnet.cronoscan.com/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    View on Explorer
                    <IconExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-6 py-4 border-b border-neutral-100 -mx-4 px-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <IconShield className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-neutral-900">
                    Network
                  </h3>
                  <p className="text-sm text-neutral-400">
                    Cronos Testnet
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
                  Active
                </span>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section>
            <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-6">
              Notifications
            </h2>
            <div className="space-y-1">
              <div className="flex items-center gap-6 py-4 border-b border-neutral-100 -mx-4 px-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <IconBell className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-neutral-900">
                    Transaction Alerts
                  </h3>
                  <p className="text-sm text-neutral-400">
                    Get notified when you receive payments
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications ? "bg-neutral-900" : "bg-neutral-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-6 py-4 border-b border-neutral-100 -mx-4 px-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <IconBell className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-neutral-900">
                    Marketing Emails
                  </h3>
                  <p className="text-sm text-neutral-400">
                    Receive updates about new features
                  </p>
                </div>
                <button
                  onClick={() => setMarketingEmails(!marketingEmails)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    marketingEmails ? "bg-neutral-900" : "bg-neutral-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      marketingEmails ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section>
            <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-6">
              Appearance
            </h2>
            <div className="space-y-1">
              <div className="flex items-center gap-6 py-4 border-b border-neutral-100 -mx-4 px-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <IconPalette className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-neutral-900">
                    Theme
                  </h3>
                  <p className="text-sm text-neutral-400">
                    Choose your preferred theme
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm font-medium text-white bg-neutral-900 rounded-lg">
                    Light
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                    Dark
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                    System
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              {saved ? (
                <>
                  <IconCheck className="w-4 h-4" />
                  Saved
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
