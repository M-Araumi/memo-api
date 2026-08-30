import { describe, expect, it, vi } from "vitest";
import app from "../src/app.js";
import * as memoSql from "../src/db/memoSql.js";

describe("GET /memos", () => {
  it("一覧を取得できる", async () => {
    const response = await app.request("/memos");

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body).toBeInstanceOf(Array);
  })
});

describe("GET /memos/:id", () => {
  it("IDを指定してメモを取得できる", async () => {
    const createResponse = await app.request("/memos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "テスト２",
        memoText: "テスト：メモのID指定取得",
      }),
    });

    const createdMemo = await createResponse.json();

    const response = await app.request(`/memos/${createdMemo.id}`);

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body.id).toBe(createdMemo.id);
    expect(body.title).toBe("テスト２");
    expect(body.memo_text).toBe("テスト：メモのID指定取得");
  });
});

describe("POST /memos", () => {
  it(" メモの新規作成ができる", async () => {
    const response = await app.request("/memos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "テスト３",
        memoText: "テスト：メモの新規作成",
      }),
    });

    expect(response.status).toBe(201);

    const body = await response.json();

    expect(body.title).toBe("テスト３");
    expect(body.memoText).toBe("テスト：メモの新規作成");
    expect(body.id).toBeDefined();
  });
});

describe("PATCH /memos/:id", () => {
  it("IDを指定してメモの更新ができる", async () => {
    const createResponse = await app.request("/memos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "テスト４",
        memoText: "テスト：メモの更新",
      }),
    });

    const createdMemo = await createResponse.json();

    const response = await app.request(`/memos/${createdMemo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "テスト４＿更新済み",
        memoText: "テスト：メモの更新＿更新済み",
      }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body.id).toBe(createdMemo.id);
    expect(body.title).toBe("テスト４＿更新済み");
    expect(body.memoText).toBe("テスト：メモの更新＿更新済み");
  });
});

describe("DELETE /memos/:id", () => {
  it("IDを指定してメモの削除ができる", async () => {
    const createResponse = await app.request("/memos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "テスト５",
        memoText: "テスト：メモの削除",
      }),
    });

    const createdMemo = await createResponse.json();

    const response = await app.request(`/memos/${createdMemo.id}`, {
      method: "DELETE",
    });

    expect(response.status).toBe(204);

  });
});

describe("POST /memos", () => {
  it("不正な入力の場合にエラーを返す", async () => {
    const response = await app.request("/memos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "あ".repeat(41),
        memoText: "テスト本文",
      }),
    });

    expect(response.status).toBe(400);

    const body = await response.json();

    expect(body.error.code).toBe("MEMO_TITLE_40WORD_OVER");
    expect(body.error.message).toBe("タイトルは４０文字以内にしてください");
  });
});

describe("GET /memos/:id", () => {
  it("存在しないIDの場合にエラーを返す", async () => {
    const response = await app.request(
      "/memos/00000000-0000-0000-0000-000000000000",
    );

    expect(response.status).toBe(404);

    const body = await response.json();

    expect(body.error.code).toBe("MEMO_NOT_FOUND");
    expect(body.error.message).toBe("指定したメモが見つかりません");
  });
});

describe("GET /memos", () => {
  it("想定外エラー時に正しいレスポンス形式を返す", async () => {
    vi.spyOn(memoSql, "getMemos").mockImplementation(() => {
      throw new Error("テスト用エラー");
    });

    const response = await app.request("/memos");

    expect(response.status).toBe(500);

    const body = await response.json();

    expect(body).toEqual({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "サーバー内部でエラーが発生しました",
      },
    });

    vi.restoreAllMocks();
  });
});