import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { createFinanceEntry } from "../actions";
import { FinanceForm } from "../finance-form";

export default async function NewFinanceEntryPage() {
  const { organization } = await requireAdmin();

  const teams = await prisma.team.findMany({
    where: { organizationId: organization.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nouvelle entrée</h1>
      </div>
      <FinanceForm
        action={createFinanceEntry}
        teams={teams}
        submitLabel="Créer"
      />
    </div>
  );
}
