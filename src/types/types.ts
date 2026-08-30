export type CreateMemoRequest = {
  title: string;
  memoText: string;
};

export type UpdateMemoRequest = {
  title?: string;
  memoText?: string;
};

export type MemoRecord = {
  id: string;
  title: string;
  memo_text: string;
  created_at: string;
  updated_at: string;
};