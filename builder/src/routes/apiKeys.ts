import { Hono } from "hono";
import { createApiKey, getApiKeysByWallet } from "../controllers/apiKey.controller";

const app = new Hono();

app.get("/:walletAddress", async (c) => {
  const walletAddress = c.req.param("walletAddress");

  try {
    const keys = await getApiKeysByWallet(walletAddress);
    return c.json(keys);
  } catch (err) {
    console.error("Failed to fetch API keys:", err);
    return c.json({ error: "Failed to fetch API keys" }, 500);
  }
});

app.post("/", async (c) => {
  const body = await c.req.json<{ walletAddress: string; name?: string }>();

  if (!body.walletAddress) {
    return c.json({ error: "walletAddress required" }, 400);
  }

  try {
    const result = await createApiKey(body.walletAddress, body.name);
    return c.json(result, 201);
  } catch (err) {
    console.error("API key creation failed:", err);
    return c.json({ error: "Failed to create API key" }, 500);
  }
});

export default app;
