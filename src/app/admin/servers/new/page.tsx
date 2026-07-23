import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { createServer } from "../actions";
import { ServerForm } from "../server-form";

export default async function NewServerPage() {
  const { organization } = await requireAdmin();

  const teams = await prisma.team.findMany({
    where: { organizationId: organization.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ajouter un serveur</h1>
      </div>
      <ServerForm action={createServer} teams={teams} submitLabel="Créer" />
    </div>
  );
}
