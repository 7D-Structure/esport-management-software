import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { toDateInputValue } from "@/lib/datetime";

export default async function NotebookPage() {
  const session = await requireUser();

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mon notebook</h1>
          <p className="text-sm text-neutral-500">
            Vos notes personnelles.
          </p>
        </div>
        <Link
          href="/space/notebook/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          + Nouvelle note
        </Link>
      </div>

      <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 dark:divide-neutral-900 dark:border-neutral-800">
        {notes.map((note) => (
          <li key={note.id}>
            <Link
              href={`/space/notebook/${note.id}`}
              className="block px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate font-medium">{note.title}</span>
                <span className="shrink-0 text-xs text-neutral-500">
                  {toDateInputValue(note.updatedAt)}
                </span>
              </div>
              {note.content && (
                <p className="mt-1 truncate text-sm text-neutral-500">
                  {note.content}
                </p>
              )}
            </Link>
          </li>
        ))}
        {notes.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-neutral-500">
            Aucune note pour le moment.
          </li>
        )}
      </ul>
    </div>
  );
}
