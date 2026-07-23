import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { createPlayer } from "../actions";
import { PlayerForm } from "../player-form";

export default async function NewPlayerPage() {
  const { organization } = await requireAdmin();

  const teams = await prisma.team.findMany({
    where: { organizationId: organization.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ajouter un joueur</h1>
      </div>
      <PlayerForm action={createPlayer} teams={teams} submitLabel="Créer" />
    </div>
  );
}
