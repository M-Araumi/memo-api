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