import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { GAME_LABELS } from "@/lib/labels";
import { GAME_VALUES } from "@/lib/validation";
import { createTeam, deleteTeam } from "./actions";

export default async function TeamsPage() {
  await requireAdmin();

  const teams = await prisma.team.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { players: true, staff: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Équipes</h1>
        <p className="text-sm text-neutral-500">
          Créez une équipe par jeu pour pouvoir y rattacher joueurs et staff.
        </p>
      </div>

      <form
        action={createTeam}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nom
          </label>
          <input
            id="name"
            name="name"
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="game" className="text-sm font-medium">
            Jeu
          </label>
          <select
            id="game"
            name="game"
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            {GAME_VALUES.map((game) => (
              <option key={game} value={game}>
                {GAME_LABELS[game]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Ajouter
        </button>
      </form>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
            <th className="py-2">Nom</th>
            <th className="py-2">Jeu</th>
            <th className="py-2">Joueurs</th>
            <th className="py-2">Staff</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr
              key={team.id}
              className="border-b border-neutral-100 dark:border-neutral-900"
            >
              <td className="py-2 font-medium">{team.name}</td>
              <td className="py-2">{GAME_LABELS[team.game]}</td>
              <td className="py-2">{team._count.players}</td>
              <td className="py-2">{team._count.staff}</td>
              <td className="py-2 text-right">
                <form action={deleteTeam}>
                  <input type="hidden" name="id" value={team.id} />
                  <button
                    type="submit"
                    className="text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {teams.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-neutral-500">
                Aucune équipe pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
