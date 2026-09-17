import { z } from "zod";

export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  createdAt: z.iso.datetime(),
});

export const noteListSchema = z.array(noteSchema);

/** What a person may submit, with the messages the form shows. */
export const noteDraftSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(80, "タイトルは80文字までです"),
  body: z.string().trim().max(500, "本文は500文字までです"),
});

export type Note = z.infer<typeof noteSchema>;
export type NoteDraft = z.infer<typeof noteDraftSchema>;
