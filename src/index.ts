import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { getMemos,getMemoById ,createMemo, updatedMemo, deleteMemo } from "./db/memoSql.js";

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
  try {
   const memos = getMemos();
    return c.json(memos);
  } catch (error) {
    console.error(error);
    return c.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "サーバー内部でエラーが発生しました",
        },
      },
      500,
    );
  }
});

app.get("/memos/:id", (c) => {
  const id = c.req.param("id");

  try {
    const memo = getMemoById(id);
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
  } catch (error) {
    console.error(error);
    return c.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "サーバー内部でエラーが発生しました",
        },
      },
      500,
    );
  }
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
  const now = new Date();
  const created_at =
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ` +
  `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  
  const newMemo = {
    id: crypto.randomUUID(),
    title: body.title,
    memoText: body.memoText,
    created_at,
    updated_at: created_at
  };

  try {
    createMemo(
     newMemo.id,
     newMemo.title,
     newMemo.memoText,
     created_at,
     newMemo.updated_at
   );
    return c.json(newMemo, 201);
  } catch (error) {
    console.error(error);
    return c.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "サーバー内部でエラーが発生しました",
        },
      },
      500,
    );
  }
});


app.patch("/memos/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<UpdateMemoRequest>();
  const now = new Date();
  const updated_at =
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ` +
  `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;


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

  try {
    const memo = getMemoById(id);
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
    const title = body.title ?? memo.title;
    const memoText = body.memoText ?? memo.memo_text;
    updatedMemo( id, title, memoText, updated_at )
    return c.json({ id, title, memoText });
  } catch (error) {
    console.error(error);
    return c.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "サーバー内部でエラーが発生しました",
        },
      },
      500,
    );
  }
});

app.delete("/memos/:id", (c) => {
  const id = c.req.param("id");

    try {
      const memo = getMemoById(id);
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
      deleteMemo(id);
      return c.body(null, 204);
    } catch (error) {
      console.error(error);
      return c.json(
      {
        error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "サーバー内部でエラーが発生しました",
        },
      },
      500,
    );
  }

});

serve({
  fetch: app.fetch,
  port: 3000,
});