"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { IconWallet } from "@tabler/icons-react";

export function Navbar() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="h-16 border-b border-neutral-200 bg-white flex items-center justify-end px-6">
      <button
        onClick={() => open()}
        className="flex items-center gap-2 px-4 py-2 bg-rose-900 text-white rounded-lg hover:bg-rose-800 transition-colors font-medium text-sm"
      >
        <IconWallet className="w-4 h-4" />
        {isConnected && address ? truncateAddress(address) : "Connect Wallet"}
      </button>
    </nav>
  );
}
