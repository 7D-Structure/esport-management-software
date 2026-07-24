import { requireAdmin } from "@/lib/require-admin";
import { createDocument } from "../actions";
import { DocumentForm } from "../document-form";

export default async function NewDocumentPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ajouter un document</h1>
      </div>
      <DocumentForm action={createDocument} submitLabel="Créer" />
    </div>
  );
}
