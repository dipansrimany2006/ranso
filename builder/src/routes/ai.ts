import { Hono } from "hono";
import { handleChat, handleToolExecution } from "../controllers/ai.controller";

const ai = new Hono();

// Streaming chat endpoint
ai.post("/chat", handleChat);

// Tool execution with payment support
ai.post("/execute-tool", handleToolExecution);

export default ai;
