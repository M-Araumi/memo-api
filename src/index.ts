import { Hono } from "hono";
import { memos } from "./data/memos.js";
import { serve } from "@hono/node-server";

const app = new Hono();

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/memos", (c) => {
  return c.json(memos);
});

serve({
  fetch: app.fetch,
  port: 3000,
});