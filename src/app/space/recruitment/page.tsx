import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

export default async function RecruitmentHubPage() {
  const session = await requireUser();
  const userId = session.user.id;

  const [profile, rosters, pendingInvites] = await Promise.all([
    prisma.playerProfile.findUnique({ where: { userId } }),
    prisma.roster.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { memberships: true } } },
    }),
    prisma.invitation.count({
      where: { toUserId: userId, status: "PENDING" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Recrutement CS2</h1>
        <p className="text-sm text-neutral-500">
          Trouvez une équipe ou des joueurs, et gérez vos invitations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/space/recruitment/players"
          className="rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
        >
          <h2 className="font-medium">Player Finder</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Parcourez les joueurs disponibles et invitez-les.
          </p>
        </Link>
        <Link
          href="/space/recruitment/teams"
          className="rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
        >
          <h2 className="font-medium">Team Finder</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Parcourez les équipes qui recrutent.
          </p>
        </Link>
        <Link
          href="/space/recruitment/invitations"
          className="rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
        >
          <h2 className="flex items-baseline justify-between font-medium">
            Mes invitations
            {pendingInvites > 0 && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs text-white">
                {pendingInvites}
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Invitations reçues à traiter.
          </p>
        </Link>
        <Link
          href="/space/recruitment/profile"
          className="rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
        >
          <h2 className="font-medium">Mon profil joueur</h2>
          <p className="mt-1 text-sm text-neutral-500">
            {profile
              ? profile.lookingForTeam
                ? "Visible dans le Player Finder."
                : "Masqué du Player Finder."
              : "Non renseigné — créez votre profil."}
          </p>
        </Link>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Mes équipes</h2>
          <Link
            href="/space/recruitment/rosters/new"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
          >
            + Créer une équipe
          </Link>
        </div>
        <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 dark:divide-neutral-900 dark:border-neutral-800">
          {rosters.map((roster) => (
            <li key={roster.id}>
              <Link
                href={`/space/recruitment/rosters/${roster.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <span className="font-medium">{roster.name}</span>
                <span className="text-sm text-neutral-500">
                  {roster._count.memberships} membre(s)
                  {roster.recruiting ? " · recrute" : ""}
                </span>
              </Link>
            </li>
          ))}
          {rosters.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-neutral-500">
              Vous ne gérez aucune équipe. Créez-en une pour inviter des joueurs.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
