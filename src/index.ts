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

app.get("/memos/:id", (c) => {
  const id = c.req.param("id");

  const memo = memos.find((memo) => memo.id === id);

  if (!memo) {
    return c.json(
      {
        error: {
          code: "MEMO_NOT_FOUND",
          message: "指定したメモが見つかりません",
        },
      },
      404,
    );
  }

  return c.json(memo);
});

serve({
  fetch: app.fetch,
  port: 3000,
});