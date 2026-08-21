import { Hono } from "hono";
import { memos } from "./data/memos.js";
import { serve } from "@hono/node-server";

type CreateMemoRequest = {
  title: string;
  memoText: string;
};

type UpdateMemoRequest = {
  title?: string;
  memoText?: string;
};

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

app.post("/memos", async (c) => {
  const body = await c.req.json<CreateMemoRequest>();

  if (!body.title) {
    return c.json(
      {
        error: {
          code: "MEMO_NOT_TITLE",
          message: "タイトルを入力してください",
        },
      },
      400,
    );
  }

  if (!body.memoText) {
   return c.json(
     {
       error: {
         code: "MEMO_NOT_TEXT",
         message: "本文を入力してください",
       },
     },
     400,
   );
  }

  if (!body.title.trim()) {
    return c.json(
      {
        error: {
          code: "MEMO_NOT_TITLE",
          message: "タイトルを入力してください",
        },
      },
      400,
    );
  }

  if (body.title.length > 40) {
    return c.json(
      {
        error: {
          code: "MEMO_TITLE_40WORD_OVER",
          message: "タイトルは４０文字以内にしてください",
        },
      },
      400,
    );
  }

  if (body.memoText.length > 250) {
    return c.json(
      {
        error: {
          code: "MEMO_TEXT_250WORD_OVER",
          message: "メモ本文は２５０文字以内にしてください",
        },
      },
      400,
    );
  }

  const newMemo = {
    id: crypto.randomUUID(),
    title: body.title,
    memoText: body.memoText,
  };

  memos.push(newMemo);

  return c.json(newMemo, 201);
});

app.patch("/memos/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<UpdateMemoRequest>();

  const memo = memos.find((memo) => memo.id === id);

  if (body.title !== undefined && body.title.length > 40) {
    return c.json(
      {
        error: {
          code: "MEMO_TITLE_40WORD_OVER",
          message: "タイトルは４０文字以内にしてください",
        },
      },
      400,
    );
  }

  if (body.memoText !== undefined && body.memoText.length > 250) {
    return c.json(
      {
        error: {
          code: "MEMO_TEXT_250WORD_OVER",
          message: "メモ本文は２５０文字以内にしてください",
        },
      },
      400,
    );
  }

  if (body.title === undefined && body.memoText === undefined) {
    return c.json(
      {
        error: {
          code: "MEMO_UPDATE_DATA_REQUIRED",
          message: "タイトルまたは本文を入力してください",
        },
      },
      400,
    );
  }

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

  if (body.title !== undefined) {
    memo.title = body.title;
  }

  if (body.memoText !== undefined) {
    memo.memoText = body.memoText;
  }

  return c.json(memo);
});

serve({
  fetch: app.fetch,
  port: 3000,
});