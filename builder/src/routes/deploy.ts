import { Hono } from "hono";
import { deploy } from "../controllers/deploy.controller";
import { validateApiKey } from "../controllers/apiKey.controller";

const app = new Hono();

app.post("/", async (c) => {
  const instanceId = process.env.MORPH_INSTANCE_ID;

  if (!instanceId) {
    return c.json({ error: "MORPH_INSTANCE_ID not configured" }, 500);
  }

  // Validate API key
  const apiKey = c.req.header("X-API-KEY");
  if (!apiKey) {
    return c.json({ error: "X-API-KEY header required" }, 401);
  }

  const keyData = await validateApiKey(apiKey);
  if (!keyData) {
    return c.json({ error: "Invalid API key" }, 401);
  }

  const body = await c.req.parseBody();
  const zipFile = body["zipFile"];
  const envVarsRaw = body["envVars"];

  if (!zipFile || !(zipFile instanceof File)) {
    return c.json({ error: "zipFile required" }, 400);
  }

  let envVars: Record<string, string> = {};
  if (typeof envVarsRaw === "string") {
    try {
      envVars = JSON.parse(envVarsRaw);
    } catch {}
  }

  try {
    const result = await deploy(instanceId, zipFile, keyData.owner, envVars);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Deploy failed";
    return c.json({ error: message, status: "failed" }, 500);
  }
});

export default app;
