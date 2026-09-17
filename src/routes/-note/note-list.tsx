"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/format-date";
import { notesQueryOptions } from "./read";

export const NoteList = () => {
  const { data: notes } = useSuspenseQuery(notesQueryOptions());

  if (notes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">メモはまだありません</p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {notes.map((note) => (
        <li key={note.id} className="rounded-lg border p-4">
          <h2 className="font-medium">{note.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{note.body}</p>
          <time
            dateTime={note.createdAt}
            className="mt-2 block text-xs text-muted-foreground tabular-nums"
          >
            {formatDate(note.createdAt)}
          </time>
        </li>
      ))}
    </ul>
  );
};
