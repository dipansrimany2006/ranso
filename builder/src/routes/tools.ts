import { Hono } from "hono";
import { getAllTools, getToolById } from "../controllers/tools.controller";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const toolsList = await getAllTools();
    return c.json(toolsList);
  } catch (err) {
    console.error("Failed to fetch tools:", err);
    return c.json({ error: "Failed to fetch tools" }, 500);
  }
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const tool = await getToolById(id);
    if (!tool) {
      return c.json({ error: "Tool not found" }, 404);
    }
    return c.json(tool);
  } catch (err) {
    console.error("Failed to fetch tool:", err);
    return c.json({ error: "Failed to fetch tool" }, 500);
  }
});

export default app;
