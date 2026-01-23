import { Hono } from "hono";
import { cors } from "hono/cors";
import deployRoutes from "./routes/deploy";
import apiKeysRoutes from "./routes/apiKeys";
import toolsRoutes from "./routes/tools";
import chatsRoutes from "./routes/chats";
import aiRoutes from "./routes/ai";

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Builder API");
});

app.route("/deploy", deployRoutes);
app.route("/api-keys", apiKeysRoutes);
app.route("/tools", toolsRoutes);
app.route("/chats", chatsRoutes);
app.route("/ai", aiRoutes);

export default {
  port: 3001,
  fetch: app.fetch,
};
