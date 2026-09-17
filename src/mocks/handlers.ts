import { HttpResponse, http } from "msw";
import { noteDraftSchema } from "@/entities/note";
import { addNote, listNotes } from "./db";

const notesUrl = `${import.meta.env.VITE_API_BASE_URL}/notes`;

export const handlers = [
  http.get(notesUrl, () => HttpResponse.json(listNotes())),
  http.post(notesUrl, async ({ request }) => {
    const draft = noteDraftSchema.safeParse(await request.json());
    if (!draft.success) {
      return HttpResponse.json(
        { message: draft.error.message },
        { status: 422 },
      );
    }
    return HttpResponse.json(addNote(draft.data), { status: 201 });
  }),
];
