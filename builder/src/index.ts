import { Hono } from "hono";
import deployRoutes from "./routes/deploy";
import apiKeysRoutes from "./routes/apiKeys";
import toolsRoutes from "./routes/tools";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Builder API");
});

app.route("/deploy", deployRoutes);
app.route("/api-keys", apiKeysRoutes);
app.route("/tools", toolsRoutes);

export default app;
