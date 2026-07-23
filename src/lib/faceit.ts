// FaceIT Data API integration for CS2 player statistics.
// Docs: https://developers.faceit.com/docs/tools/data-api
//
// The integration is fully optional: when FACEIT_API_KEY is unset, callers get
// a "not configured" result and the UI degrades gracefully.

const FACEIT_BASE = "https://open.faceit.com/data/v4";
const REQUEST_TIMEOUT_MS = 8000;

export function isFaceitConfigured(): boolean {
  return Boolean(process.env.FACEIT_API_KEY);
}

export type FaceitStats = {
  nickname: string;
  playerId: string;
  country?: string;
  skillLevel?: number;
  faceitElo?: number;
  faceitUrl?: string;
  avatar?: string;
  lifetime?: {
    matches?: string;
    winRate?: string;
    kdRatio?: string;
    averageKills?: string;
    headshotPercent?: string;
    currentWinStreak?: string;
    longestWinStreak?: string;
  };
};

export type FaceitResult =
  | { ok: true; stats: FaceitStats }
  | { ok: false; reason: "not_configured" | "not_found" | "error"; message: string };

async function faceitFetch(path: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(`${FACEIT_BASE}${path}`, {
      headers: { Authorization: `Bearer ${process.env.FACEIT_API_KEY}` },
      signal: controller.signal,
      // Stats change over time; cache briefly to avoid hammering the API.
      next: { revalidate: 300 },
    });
  } finally {
    clearTimeout(timeout);
  }
}

// Fetch CS2 lifetime stats for a player by their FaceIT nickname.
export async function getFaceitStats(nickname: string): Promise<FaceitResult> {
  if (!isFaceitConfigured()) {
    return {
      ok: false,
      reason: "not_configured",
      message: "Intégration FaceIT non configurée (définir FACEIT_API_KEY).",
    };
  }

  try {
    const playerRes = await faceitFetch(
      `/players?nickname=${encodeURIComponent(nickname)}`,
    );

    if (playerRes.status === 404) {
      return {
        ok: false,
        reason: "not_found",
        message: `Aucun joueur FaceIT trouvé pour « ${nickname} ».`,
      };
    }
    if (!playerRes.ok) {
      return {
        ok: false,
        reason: "error",
        message: `Erreur FaceIT (HTTP ${playerRes.status}).`,
      };
    }

    const player = (await playerRes.json()) as FaceitPlayerResponse;
    const cs2 = player.games?.cs2;

    const stats: FaceitStats = {
      nickname: player.nickname,
      playerId: player.player_id,
      country: player.country,
      skillLevel: cs2?.skill_level,
      faceitElo: cs2?.faceit_elo,
      faceitUrl: player.faceit_url?.replace("{lang}", "en"),
      avatar: player.avatar,
    };

    // Lifetime stats are a separate endpoint; failure here is non-fatal.
    try {
      const statsRes = await faceitFetch(`/players/${player.player_id}/stats/cs2`);
      if (statsRes.ok) {
        const body = (await statsRes.json()) as FaceitStatsResponse;
        const l = body.lifetime ?? {};
        stats.lifetime = {
          matches: l["Matches"],
          winRate: l["Win Rate %"],
          kdRatio: l["Average K/D Ratio"],
          averageKills: l["Average Kills"],
          headshotPercent: l["Average Headshots %"],
          currentWinStreak: l["Current Win Streak"],
          longestWinStreak: l["Longest Win Streak"],
        };
      }
    } catch {
      // Ignore lifetime failures; the base profile is still useful.
    }

    return { ok: true, stats };
  } catch {
    return {
      ok: false,
      reason: "error",
      message: "Impossible de contacter l'API FaceIT.",
    };
  }
}

type FaceitPlayerResponse = {
  player_id: string;
  nickname: string;
  country?: string;
  avatar?: string;
  faceit_url?: string;
  games?: {
    cs2?: { skill_level?: number; faceit_elo?: number };
  };
};

type FaceitStatsResponse = {
  lifetime?: Record<string, string>;
};
