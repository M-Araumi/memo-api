import database from "./database.js";

type MemoRecord = {
  id: string;
  title: string;
  memo_text: string;
  created_at: string;
  updated_at: string;
};

export function getMemos() {
  const statement = database.prepare(`
    SELECT *
    FROM memos
  `);

  return statement.all();
}

export function getMemoById(id: string): MemoRecord | undefined {
  const statement = database.prepare(`
    SELECT *
    FROM memos
    WHERE id = ?
  `);
  
  return statement.get(id) as MemoRecord | undefined;
}

export function createMemo(
  id: string,
  title: string,
  memoText: string,
  createdAt: string,
  updatedAt: string,
) {
  const statement = database.prepare(`
    INSERT INTO memos (
      id,
      title,
      memo_text,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?)
  `);

  statement.run(id, title, memoText, createdAt, updatedAt);
}

export function updatedMemo(
  id: string,
  title: string,
  memoText: string,
  updatedAt: string,
) {
  const statement = database.prepare(`
    UPDATE memos
    SET title = ?, memo_text = ?, updated_at = ?
    WHERE id = ?
  `);

  statement.run(title, memoText, updatedAt, id)
}