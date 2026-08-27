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

  try{
    return statement.all();
  }catch(error){
  console.error(error);
    throw new Error("メモの取得に失敗しました")
  };
}

export function getMemoById(id: string): MemoRecord | undefined {
  const statement = database.prepare(`
    SELECT *
    FROM memos
    WHERE id = ?
  `);
  
  try{
    return statement.get(id) as MemoRecord | undefined;
  }catch(error){
    console.error(error);
    throw new Error("メモの取得に失敗しました")
  };
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

  try{
    statement.run(id, title, memoText, createdAt, updatedAt);
  }catch(error){
    console.error(error);
    throw new Error("メモの追加に失敗しました")
  };
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

  try{
    statement.run(title, memoText, updatedAt, id)
  }catch(error){
    console.error(error);
    throw new Error("メモの更新に失敗しました")
  };
}

export function deleteMemo(id: string){
  const statement = database.prepare(`
    DELETE FROM memos  
    WHERE id = ?
  `);

  try{
    statement.run(id)
  }catch(error){
    console.error(error);
    throw new Error("メモの削除に失敗しました")
  };
}