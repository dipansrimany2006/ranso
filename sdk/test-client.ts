import { ethers } from "ethers";
import { Facilitator, CronosNetwork } from "@crypto.com/facilitator-client";
import { createPublicClient, http, formatUnits } from "viem";
import { cronosTestnet } from "viem/chains";

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY env required");

const TOOL_URL =
  "https://0x419e5a_190e43a1-morphvm-df0fp5na.http.cloud.morph.so/send";
const USDC_CONTRACT = "0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0" as const;

// ERC20 balanceOf ABI
const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

async function getBalance(
  client: ReturnType<typeof createPublicClient>,
  address: `0x${string}`,
) {
  const balance = await client.readContract({
    address: USDC_CONTRACT,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address],
  });
  return balance;
}

async function main() {
  // Setup
  const provider = new ethers.JsonRpcProvider("https://evm-t3.cronos.org");
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const facilitator = new Facilitator({ network: CronosNetwork.CronosTestnet });

  const publicClient = createPublicClient({
    chain: cronosTestnet,
    transport: http(),
  });

  console.log("Wallet:", signer.address);

  // Check balance BEFORE
  const balanceBefore = await getBalance(
    publicClient,
    signer.address as `0x${string}`,
  );
  console.log("USDC Balance BEFORE:", formatUnits(balanceBefore, 6), "USDC");

  // 1. Request without payment → get 402
  console.log("\n--- Step 1: Get payment requirements ---");
  const res402 = await fetch(TOOL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Alice" }),
  });

  if (res402.status !== 402) {
    console.log("Unexpected status:", res402.status);
    const body = await res402.text();
    console.log("Body:", body);
    return;
  }

  const requirementsHeader = res402.headers.get("x-payment-required");
  const requirements = JSON.parse(
    Buffer.from(requirementsHeader!, "base64").toString(),
  );
  console.log("Requirements:", requirements);

  // 2. Generate payment header using facilitator client
  console.log("\n--- Step 2: Generate payment header ---");
  // Value is already in base units from server
  const amountHuman = formatUnits(BigInt(requirements.maxAmountRequired), 6);
  console.log(
    "Amount:",
    amountHuman,
    "USDC (",
    requirements.maxAmountRequired,
    "base units)",
  );

  const paymentHeader = await facilitator.generatePaymentHeader({
    to: requirements.payTo,
    value: requirements.maxAmountRequired, // already base units
    signer,
    validBefore: Math.floor(Date.now() / 1000) + 600, // 10 min expiry
  });

  console.log("Payment header generated");

  // 3. Send request with payment
  console.log("\n--- Step 3: Send request with payment ---");
  console.log("(Server will verify and settle the payment onchain)");

  const resPaid = await fetch(TOOL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-PAYMENT": paymentHeader,
    },
    body: JSON.stringify({ name: "Roy" }),
  });

  console.log("\nStatus:", resPaid.status);
  const body = await resPaid.json();
  console.log("Response:", body);

  // Check balance AFTER
  console.log(
    "\n--- Checking balance after (waiting 3s for tx confirmation) ---",
  );
  await new Promise((r) => setTimeout(r, 3000));

  const balanceAfter = await getBalance(
    publicClient,
    signer.address as `0x${string}`,
  );
  console.log("USDC Balance AFTER:", formatUnits(balanceAfter, 6), "USDC");
  console.log(
    "Difference:",
    formatUnits(balanceBefore - balanceAfter, 6),
    "USDC",
  );
}

main().catch(console.error);
