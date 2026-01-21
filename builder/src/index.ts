import { Hono } from "hono";
import deployRoutes from "./routes/deploy";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Builder API");
});

app.route("/deploy", deployRoutes);

export default app;
