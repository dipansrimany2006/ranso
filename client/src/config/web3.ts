import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum, polygon, optimism, base } from "@reown/appkit/networks";

// Get projectId from environment variable
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "";

if (!projectId) {
  console.warn("NEXT_PUBLIC_REOWN_PROJECT_ID is not set");
}

// Define the networks
export const networks = [mainnet, arbitrum, polygon, optimism, base];

// Create the Wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
