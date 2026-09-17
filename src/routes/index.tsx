import { createFileRoute } from "@tanstack/react-router";
import { NoteForm } from "./-note/note-form";
import { NoteList } from "./-note/note-list";
import { notesQueryOptions } from "./-note/read";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.query(notesQueryOptions()),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <NoteForm />
      <NoteList />
    </div>
  );
}
