import { createx402Tool } from "@axicov/x402-cronos-sdk";
import { z } from "zod";

const InputSchema = z.object({
  name: z.string().describe("Name to greet"),
});
const OutputSchema = z.object({
  greeting: z.string().describe("Greeting message"),
});

type Input = z.infer<typeof InputSchema>;
type Output = z.infer<typeof OutputSchema>;

const DEV_WALLET =
  process.env.DEV_WALLET || "0x0000000000000000000000000000000000000000";
const PORT = parseInt(process.env.PORT || "8000");
const PRICE = parseFloat(process.env.PRICE || "0.02"); // USDC

createx402Tool<Input, Output>(
  async (input) => {
    return { greeting: `Hello ${input.name}` };
  },
  {
    price: PRICE,
    devWallet: DEV_WALLET,
    port: PORT,
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
  },
);

console.log(`Server running on port ${PORT}`);
