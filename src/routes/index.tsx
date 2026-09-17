import { createFileRoute } from "@tanstack/react-router";
import { NoteForm } from "@/components/features/note-form/note-form";
import { NoteList } from "@/components/features/note-list/note-list";
import { notesQueryOptions } from "@/gateways/note/read";

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
