import { createx402Tool } from "@axicov/x402-cronos-sdk";

// Load env vars
const DEV_WALLET = process.env.DEV_WALLET || "0x0000000000000000000000000000000000000000";
const PORT = parseInt(process.env.PORT || "8000");
const PRICE = parseFloat(process.env.PRICE || "0.02"); // USDC

// Your x402 monetized endpoint
createx402Tool(
  async (input: { name: string }) => {
    // Your logic here
    return { greeting: `Hello ${input.name}` };
  },
  {
    price: PRICE,
    devWallet: DEV_WALLET,
    port: PORT,
  }
);

console.log(`Server running on port ${PORT}`);
