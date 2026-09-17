import { queryOptions } from "@tanstack/react-query";
import { type Note, noteListSchema } from "@/entities/note";
import { apiFetch } from "@/lib/api-client";
import { NOTES_PATH } from "./index";

export const fetchNotes = async (signal: AbortSignal | null): Promise<Note[]> =>
  noteListSchema.parse(await apiFetch(NOTES_PATH, { signal }));

export const notesQueryOptions = () =>
  queryOptions({
    queryKey: ["note", "list"],
    queryFn: ({ signal }) => fetchNotes(signal),
  });
