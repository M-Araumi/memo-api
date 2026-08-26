import database from "./database.js";

export function getMemos() {
  const statement = database.prepare(`
    SELECT *
    FROM memos
  `);

  return statement.all();
}

export function getMemoById(id: string) {
  const statement = database.prepare(`
    SELECT *
    FROM memos
    WHERE id = ?
  `);

  return statement.get(id);
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