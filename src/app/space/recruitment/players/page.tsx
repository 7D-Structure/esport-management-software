import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { GAME_LABELS } from "@/lib/labels";
import { invitePlayer } from "../actions";

export default async function PlayerFinderPage() {
  const session = await requireUser();
  const userId = session.user.id;

  const [profiles, myRosters] = await Promise.all([
    prisma.playerProfile.findMany({
      where: {
        game: "CS2",
        lookingForTeam: true,
        userId: { not: userId },
      },
      orderBy: { updatedAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.roster.findMany({
      where: { ownerId: userId, recruiting: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Player Finder — CS2</h1>
        <p className="text-sm text-neutral-500">
          Joueurs à la recherche d&apos;une équipe. Invitez-les dans l&apos;une
          de vos équipes.
        </p>
      </div>

      {myRosters.length === 0 && (
        <p className="rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-500 dark:border-neutral-800">
          Vous ne gérez aucune équipe qui recrute.{" "}
          <Link
            href="/space/recruitment/rosters/new"
            className="font-medium underline"
          >
            Créez-en une
          </Link>{" "}
          pour pouvoir inviter des joueurs.
        </p>
      )}

      <ul className="space-y-3">
        {profiles.map((profile) => (
          <li
            key={profile.id}
            className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-medium">{profile.user.name}</span>
              <span className="text-xs text-neutral-500">
                {GAME_LABELS[profile.game]}
              </span>
              {profile.inGameRole && (
                <span className="text-xs text-neutral-500">
                  · {profile.inGameRole}
                </span>
              )}
              {profile.faceitNickname && (
                <span className="text-xs text-neutral-500">
                  · FaceIT: {profile.faceitNickname}
                </span>
              )}
            </div>
            {profile.availability && (
              <p className="mt-1 text-sm text-neutral-500">
                Dispo : {profile.availability}
              </p>
            )}
            {profile.bio && (
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {profile.bio}
              </p>
            )}

            {myRosters.length > 0 && (
              <form
                action={invitePlayer.bind(null, profile.userId)}
                className="mt-3 flex flex-wrap items-end gap-2"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium">Équipe</label>
                  <select
                    name="rosterId"
                    className="rounded-md border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    {myRosters.map((roster) => (
                      <option key={roster.id} value={roster.id}>
                        {roster.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-xs font-medium">
                    Message (optionnel)
                  </label>
                  <input
                    name="message"
                    placeholder="Rejoins-nous !"
                    className="rounded-md border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
                >
                  Inviter
                </button>
              </form>
            )}
          </li>
        ))}
        {profiles.length === 0 && (
          <li className="rounded-lg border border-neutral-200 px-4 py-6 text-center text-sm text-neutral-500 dark:border-neutral-800">
            Aucun joueur disponible pour le moment.
          </li>
        )}
      </ul>
    </div>
  );
}
