import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { FinanceForm } from "../finance-form";
import { deleteFinanceEntry, updateFinanceEntry } from "../actions";

export default async function EditFinanceEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { organization } = await requireAdmin();
  const { id } = await params;

  const [entry, teams] = await Promise.all([
    prisma.financeEntry.findFirst({
      where: { id, organizationId: organization.id },
    }),
    prisma.team.findMany({
      where: { organizationId: organization.id },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!entry) {
    notFound();
  }

  const updateEntryWithId = updateFinanceEntry.bind(null, id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{entry.label}</h1>
        <form action={deleteFinanceEntry}>
          <input type="hidden" name="id" value={entry.id} />
          <button
            type="submit"
            className="text-sm text-red-600 hover:underline"
          >
            Supprimer l&apos;entrée
          </button>
        </form>
      </div>

      <FinanceForm
        action={updateEntryWithId}
        teams={teams}
        defaults={entry}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
