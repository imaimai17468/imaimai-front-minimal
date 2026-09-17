import { Suspense } from "react";

export const dynamic = "force-dynamic";
import { NoteForm } from "@/routes/-note/note-form";
import { NoteList } from "@/routes/-note/note-list";

const loadingFallback = (
  <p className="text-sm text-muted-foreground">読み込み中</p>
);

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <NoteForm />
      <Suspense fallback={loadingFallback}>
        <NoteList />
      </Suspense>
    </div>
  );
}
