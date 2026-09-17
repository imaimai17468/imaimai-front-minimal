import { apiFetch } from "@/lib/api-client";
import { NOTES_PATH } from "./endpoint";
import { type Note, type NoteDraft, noteSchema } from "./note";

export const createNote = async (draft: NoteDraft): Promise<Note> =>
  noteSchema.parse(
    await apiFetch(NOTES_PATH, {
      method: "POST",
      body: JSON.stringify(draft),
    }),
  );
