import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { DocumentForm } from "../document-form";
import { deleteDocument, updateDocument } from "../actions";

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const doc = await prisma.document.findUnique({ where: { id } });

  if (!doc) {
    notFound();
  }

  const updateDocumentWithId = updateDocument.bind(null, id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{doc.title}</h1>
        <form action={deleteDocument}>
          <input type="hidden" name="id" value={doc.id} />
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Supprimer le document
          </button>
        </form>
      </div>

      <DocumentForm
        action={updateDocumentWithId}
        defaults={doc}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
