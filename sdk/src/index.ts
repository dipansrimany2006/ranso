import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { zodToJsonSchema } from "zod-to-json-schema";
import { x402Middleware } from "./middleware";
import type { X402Config } from "./types";

export function createx402Tool<TInput, TOutput>(
  fn: (input: TInput) => Promise<TOutput>,
  config: X402Config
) {
  const app = new Hono();

  // Schema endpoint for deploy-time introspection
  app.get("/schema", (c) => {
    return c.json({
      price: config.price,
      inputSchema: config.inputSchema
        ? zodToJsonSchema(config.inputSchema)
        : null,
      outputSchema: config.outputSchema
        ? zodToJsonSchema(config.outputSchema)
        : null,
    });
  });

  app.post("/send", x402Middleware(config), async (c) => {
    const input = await c.req.json<TInput>();
    const result = await fn(input);
    return c.json(result);
  });

  const port = config.port ?? 3000;
  serve({ fetch: app.fetch, port });
  console.log(`x402 tool running on :${port}/send`);

  return app;
}

export type { X402Config } from "./types";
export { Facilitator, CronosNetwork } from "@crypto.com/facilitator-client";
