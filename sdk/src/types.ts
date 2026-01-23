import type { ZodType } from "zod";

export interface X402Config {
  /** Price in USDC (e.g. 0.02 for 2 cents) */
  price: number;
  devWallet: string;
  port?: number;
  description?: string;
  /** Zod schema for input validation & introspection */
  inputSchema?: ZodType;
  /** Zod schema for output type & introspection */
  outputSchema?: ZodType;
}
