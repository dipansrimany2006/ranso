import { Facilitator, CronosNetwork } from "@crypto.com/facilitator-client";
import { walletClientToSigner } from "./ethers-adapter";
import type { WalletClient } from "viem";

export const facilitator = new Facilitator({
  network: CronosNetwork.CronosTestnet,
});

export async function createPaymentHeader(
  requirements: { payTo: string; maxAmountRequired: string },
  walletClient: WalletClient
): Promise<string> {
  console.log("[Payment] Creating payment header with requirements:", requirements);

  const signer = await walletClientToSigner(walletClient);
  const signerAddress = await signer.getAddress();
  console.log("[Payment] Signer address:", signerAddress);

  const paymentHeader = await facilitator.generatePaymentHeader({
    to: requirements.payTo,
    value: requirements.maxAmountRequired,
    signer,
    validBefore: Math.floor(Date.now() / 1000) + 600,
  });

  console.log("[Payment] Generated payment header:", paymentHeader.substring(0, 50) + "...");
  return paymentHeader;
}

export { CronosNetwork };
