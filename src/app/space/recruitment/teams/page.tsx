import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { GAME_LABELS } from "@/lib/labels";

export default async function TeamFinderPage() {
  await requireUser();

  const rosters = await prisma.roster.findMany({
    where: { game: "CS2", recruiting: true },
    orderBy: { updatedAt: "desc" },
    include: {
      owner: { select: { name: true } },
      _count: { select: { memberships: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Team Finder — CS2</h1>
        <p className="text-sm text-neutral-500">
          Équipes qui recrutent. Renseignez votre profil pour être repéré et
          invité.
        </p>
      </div>

      <ul className="space-y-3">
        {rosters.map((roster) => (
          <li
            key={roster.id}
            className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-medium">{roster.name}</span>
              <span className="text-xs text-neutral-500">
                {GAME_LABELS[roster.game]}
              </span>
              <span className="text-xs text-neutral-500">
                · {roster._count.memberships} membre(s)
              </span>
              <span className="text-xs text-neutral-500">
                · par {roster.owner.name}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-3 text-sm text-neutral-500">
              {roster.roleNeeded && <span>Recherche : {roster.roleNeeded}</span>}
              {roster.minFaceitLevel && (
                <span>Niveau FaceIT min : {roster.minFaceitLevel}</span>
              )}
            </div>
            {roster.description && (
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {roster.description}
              </p>
            )}
          </li>
        ))}
        {rosters.length === 0 && (
          <li className="rounded-lg border border-neutral-200 px-4 py-6 text-center text-sm text-neutral-500 dark:border-neutral-800">
            Aucune équipe ne recrute pour le moment.
          </li>
        )}
      </ul>
    </div>
  );
}
