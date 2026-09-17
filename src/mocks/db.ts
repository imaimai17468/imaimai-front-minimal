import type { Note, NoteDraft } from "@app/_note/api/note";

const seed = (): Note[] => [
  {
    id: "note-1",
    title: "スタック選定の前提",
    body: "MCP もプラグインも無い環境で回ることを条件にする。",
    createdAt: "2026-01-06T09:00:00.000Z",
  },
];

let notes: Note[] = seed();

export const listNotes = (): readonly Note[] => notes;

export const addNote = (draft: NoteDraft): Note => {
  const note: Note = {
    id: `note-${notes.length + 1}`,
    title: draft.title,
    body: draft.body,
    createdAt: new Date().toISOString(),
  };
  notes = [note, ...notes];
  return note;
};

/** `src/test-setup.ts` calls this after each test. */
export const resetNotes = (): void => {
  notes = seed();
};
