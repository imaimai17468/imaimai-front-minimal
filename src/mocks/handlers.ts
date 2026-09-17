import { noteDraftSchema } from "@app/_note/api/note";
import { HttpResponse, http } from "msw";
import { addNote, listNotes } from "./db";

const notesUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/notes`;

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
