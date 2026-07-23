import { getFaceitStats, isFaceitConfigured } from "@/lib/faceit";

function StatTile({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-md border border-neutral-200 p-3 dark:border-neutral-800">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value ?? "—"}</div>
    </div>
  );
}

// Server component: fetches CS2 stats for the player's FaceIT nickname.
export async function FaceitStats({
  nickname,
}: {
  nickname: string | null;
}) {
  const configured = isFaceitConfigured();

  return (
    <section className="max-w-2xl space-y-3">
      <h2 className="text-lg font-semibold">Stats CS2 (FaceIT)</h2>

      {!configured && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          Intégration FaceIT non configurée. Définissez{" "}
          <code>FACEIT_API_KEY</code> pour activer les statistiques.
        </p>
      )}

      {configured && !nickname && (
        <p className="text-sm text-neutral-500">
          Renseignez le pseudo FaceIT du joueur pour afficher ses statistiques.
        </p>
      )}

      {configured && nickname && (
        <FaceitStatsData nickname={nickname} />
      )}
    </section>
  );
}

async function FaceitStatsData({ nickname }: { nickname: string }) {
  const result = await getFaceitStats(nickname);

  if (!result.ok) {
    return (
      <p className="rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-500 dark:border-neutral-800">
        {result.message}
      </p>
    );
  }

  const { stats } = result;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium">{stats.nickname}</span>
        {typeof stats.skillLevel === "number" && (
          <span className="text-neutral-500">Niveau {stats.skillLevel}</span>
        )}
        {typeof stats.faceitElo === "number" && (
          <span className="text-neutral-500">{stats.faceitElo} elo</span>
        )}
        {stats.faceitUrl && (
          <a
            href={stats.faceitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 hover:underline dark:text-neutral-400"
          >
            Profil ↗
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Matchs" value={stats.lifetime?.matches} />
        <StatTile label="Winrate" value={stats.lifetime?.winRate ? `${stats.lifetime.winRate}%` : undefined} />
        <StatTile label="K/D" value={stats.lifetime?.kdRatio} />
        <StatTile label="HS %" value={stats.lifetime?.headshotPercent ? `${stats.lifetime.headshotPercent}%` : undefined} />
      </div>
    </div>
  );
}
