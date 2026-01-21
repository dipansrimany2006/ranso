import { Hono } from "hono";
import { deploy } from "../controllers/deploy.controller";

const app = new Hono();

app.post("/", async (c) => {
  const instanceId = process.env.MORPH_INSTANCE_ID;

  if (!instanceId) {
    return c.json({ error: "MORPH_INSTANCE_ID not configured" }, 500);
  }

  const body = await c.req.parseBody();
  const zipFile = body["zipFile"];

  if (!zipFile || !(zipFile instanceof File)) {
    return c.json({ error: "zipFile required" }, 400);
  }

  try {
    const result = await deploy(instanceId, zipFile);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Deploy failed";
    return c.json({ error: message, status: "failed" }, 500);
  }
});

export default app;
