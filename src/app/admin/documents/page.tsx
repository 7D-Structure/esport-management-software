import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/labels";

export default async function DocumentsPage() {
  await requireAdmin();

  const documents = await prisma.document.findMany({
    orderBy: [{ category: "asc" }, { title: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Documents</h1>
          <p className="text-sm text-neutral-500">
            Documents associatifs et administratifs, accessibles aux joueurs et
            au staff.
          </p>
        </div>
        <Link
          href="/admin/documents/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          + Ajouter un document
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
            <th className="py-2">Titre</th>
            <th className="py-2">Catégorie</th>
            <th className="py-2">Lien</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr
              key={doc.id}
              className="border-b border-neutral-100 hover:bg-neutral-50 dark:border-neutral-900 dark:hover:bg-neutral-900"
            >
              <td className="py-2">
                <Link
                  href={`/admin/documents/${doc.id}`}
                  className="font-medium hover:underline"
                >
                  {doc.title}
                </Link>
              </td>
              <td className="py-2">
                {DOCUMENT_CATEGORY_LABELS[doc.category]}
              </td>
              <td className="py-2">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-600 hover:underline dark:text-neutral-400"
                >
                  Ouvrir ↗
                </a>
              </td>
            </tr>
          ))}
          {documents.length === 0 && (
            <tr>
              <td colSpan={3} className="py-6 text-center text-neutral-500">
                Aucun document pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
