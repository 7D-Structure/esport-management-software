import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { NoteForm } from "../note-form";
import { deleteNote, updateNote } from "../actions";

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser();
  const { id } = await params;

  const note = await prisma.note.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!note) {
    notFound();
  }

  const updateNoteWithId = updateNote.bind(null, id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{note.title}</h1>
        <form action={deleteNote}>
          <input type="hidden" name="id" value={note.id} />
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Supprimer
          </button>
        </form>
      </div>

      <NoteForm
        action={updateNoteWithId}
        defaults={note}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
