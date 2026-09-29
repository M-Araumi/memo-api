import { Hono } from "hono";
import { cors } from "hono/cors";
import { getMemos,getMemoById ,createMemo, updatedMemo, deleteMemo } from "./db/memoSql.js";
import { validateMemoText, validateMemoTitle } from "./validators/memoValidators.js";
import { createMemoSchema,updateMemoSchema } from "./schemas/memoSchema.js";
import type { CreateMemoRequest, UpdateMemoRequest } from "./schemas/memoSchema.js";

const app = new Hono();

app.use("*", cors({
  origin: "http://localhost:3001",
}));

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
  let body;
  try {
   body = await c.req.json();
  } catch {
    return c.json({
      error:{
        code: "INVALID_JSON",
        message: "不正なJSONです",
      },
    },400,);
  }
  const result = createMemoSchema.safeParse(body);
  if(!result.success){
  return c.json({ error: "不正な入力です" }, 400);
  }
  const checkedBody = result.data;
 
  const titleError = validateMemoTitle(checkedBody.title);
  if (titleError) {
    return c.json({ error: titleError }, 400);
  }

  const memoTextError = validateMemoText(checkedBody.memoText);
  if (memoTextError) {
  return c.json({ error: memoTextError }, 400);
  }

  const now = new Date();
  const created_at =
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ` +
  `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  
  const newMemo = {
    id: crypto.randomUUID(),
    title: checkedBody.title,
    memo_text: checkedBody.memoText,
    created_at,
    updated_at: created_at
  };

  try {
    createMemo(
     newMemo.id,
     newMemo.title,
     newMemo.memo_text,
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
  let body;
  try {
   body = await c.req.json();
  } catch {
    return c.json({
      error:{
        code: "INVALID_JSON",
        message: "不正なJSONです",
      },
    },400,);
  }
  const result = updateMemoSchema.safeParse(body);
  if (!result.success) {
    return c.json({ error: "不正な入力です" }, 400);
  }
  const checkedBody = result.data;
  const now = new Date();
  const updated_at =
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ` +
  `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  if (checkedBody.title !== undefined) {
    const titleError = validateMemoTitle(checkedBody.title);
    if (titleError) {
      return c.json({ error: titleError }, 400);
    }
  }

  if (checkedBody.memoText !== undefined) {
    const memoTextError = validateMemoText(checkedBody.memoText);
    if (memoTextError) {
    return c.json({ error: memoTextError }, 400);
    }
  }
  if (checkedBody.title === undefined && checkedBody.memoText === undefined) {
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
    const title = checkedBody.title ?? memo.title;
    const memo_text = checkedBody.memoText ?? memo.memo_text;
    updatedMemo( id, title, memo_text, updated_at )
    return c.json({ id, title, memo_text });
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

export default app;