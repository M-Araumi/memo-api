import { z } from "zod";

export const createMemoSchema = z.object({
  title: z.string(),
  memoText: z.string(),
});
export type CreateMemoRequest = z.infer<typeof createMemoSchema>;

export const updateMemoSchema = z.object({
  title: z.string().optional(),
  memoText: z.string().optional(),
});
export type UpdateMemoRequest = z.infer<typeof updateMemoSchema>;