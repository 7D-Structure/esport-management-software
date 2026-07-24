import { requireUser } from "@/lib/require-user";
import { createNote } from "../actions";
import { NoteForm } from "../note-form";

export default async function NewNotePage() {
  await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nouvelle note</h1>
      </div>
      <NoteForm action={createNote} submitLabel="Créer" />
    </div>
  );
}
