import { BrowserProvider, JsonRpcSigner } from "ethers";
import type { WalletClient } from "viem";

export async function walletClientToSigner(
  walletClient: WalletClient
): Promise<JsonRpcSigner> {
  const { account } = walletClient;

  // Use window.ethereum as the provider since viem's transport isn't directly compatible
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No ethereum provider found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner(account!.address);
  return signer;
}
