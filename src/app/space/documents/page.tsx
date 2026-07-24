import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/labels";

export default async function SpaceDocumentsPage() {
  await requireUser();

  const documents = await prisma.document.findMany({
    orderBy: [{ category: "asc" }, { title: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Documents</h1>
        <p className="text-sm text-neutral-500">
          Documents associatifs et administratifs de la structure.
        </p>
      </div>

      <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 dark:divide-neutral-900 dark:border-neutral-800">
        {documents.map((doc) => (
          <li key={doc.id} className="px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="truncate font-medium">{doc.title}</span>
                  <span className="shrink-0 text-xs text-neutral-500">
                    {DOCUMENT_CATEGORY_LABELS[doc.category]}
                  </span>
                </div>
                {doc.description && (
                  <p className="mt-1 text-sm text-neutral-500">
                    {doc.description}
                  </p>
                )}
              </div>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-sm text-neutral-600 hover:underline dark:text-neutral-400"
              >
                Ouvrir ↗
              </a>
            </div>
          </li>
        ))}
        {documents.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-neutral-500">
            Aucun document disponible.
          </li>
        )}
      </ul>
    </div>
  );
}
