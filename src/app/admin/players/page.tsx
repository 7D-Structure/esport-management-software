import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { GAME_LABELS, LICENSE_STATUS_LABELS } from "@/lib/labels";

export default async function PlayersPage() {
  const { organization } = await requireAdmin();

  const players = await prisma.player.findMany({
    where: { organizationId: organization.id },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: { team: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Joueurs</h1>
          <p className="text-sm text-neutral-500">
            Licences, rôles, contacts et disponibilités de vos joueurs.
          </p>
        </div>
        <Link
          href="/admin/players/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          + Ajouter un joueur
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
            <th className="py-2">Nom</th>
            <th className="py-2">Pseudo</th>
            <th className="py-2">Jeu</th>
            <th className="py-2">Équipe</th>
            <th className="py-2">Licence</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr
              key={player.id}
              className="border-b border-neutral-100 hover:bg-neutral-50 dark:border-neutral-900 dark:hover:bg-neutral-900"
            >
              <td className="py-2">
                <Link
                  href={`/admin/players/${player.id}`}
                  className="font-medium hover:underline"
                >
                  {player.firstName} {player.lastName}
                </Link>
              </td>
              <td className="py-2">{player.gamertag}</td>
              <td className="py-2">{GAME_LABELS[player.game]}</td>
              <td className="py-2">{player.team?.name ?? "—"}</td>
              <td className="py-2">
                {LICENSE_STATUS_LABELS[player.licenseStatus]}
              </td>
            </tr>
          ))}
          {players.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-neutral-500">
                Aucun joueur pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
