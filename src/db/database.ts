import Database from "better-sqlite3";

const databasePath = process.env.DATABASE_PATH ?? "memo.db";
const database: Database.Database = new Database(databasePath);

database.exec(`
  CREATE TABLE IF NOT EXISTS memos (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    memo_text TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

export default database;