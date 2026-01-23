"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider, type Config } from "wagmi";
import { wagmiAdapter, projectId, networks } from "@/config/web3";
import { ReactNode, useState } from "react";

// Set up metadata
const metadata = {
  name: "Axicov",
  description: "AI-powered platform",
  url: typeof window !== "undefined" ? window.location.origin : "https://axicov.com",
  icons: ["/logo.png"],
};

// Create the modal
if (projectId) {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    metadata,
    features: {
      analytics: true,
    },
    themeMode: "light",
    themeVariables: {
      "--w3m-accent": "#881337",
      "--w3m-border-radius-master": "2px",
    },
  });
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
