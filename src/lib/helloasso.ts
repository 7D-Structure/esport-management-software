// HelloAsso API integration for membership synchronization.
// Docs: https://dev.helloasso.com/docs
//
// Uses the OAuth2 client-credentials flow. Fully optional: when the credentials
// are unset, callers get a "not configured" result and the UI degrades.

const REQUEST_TIMEOUT_MS = 10000;

function apiBase(): string {
  return process.env.HELLOASSO_API_BASE || "https://api.helloasso.com";
}

export function isHelloAssoConfigured(): boolean {
  return Boolean(
    process.env.HELLOASSO_CLIENT_ID &&
      process.env.HELLOASSO_CLIENT_SECRET &&
      process.env.HELLOASSO_ORGANIZATION_SLUG,
  );
}

export type HelloAssoMember = {
  // Stable identifier we can match on (order item id).
  memberId: string;
  firstName: string;
  lastName: string;
  email?: string;
  state?: string;
};

export type HelloAssoResult =
  | { ok: true; members: HelloAssoMember[] }
  | { ok: false; reason: "not_configured" | "error"; message: string };

async function withTimeout(input: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function getAccessToken(): Promise<string> {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.HELLOASSO_CLIENT_ID as string,
    client_secret: process.env.HELLOASSO_CLIENT_SECRET as string,
  });

  const res = await withTimeout(`${apiBase()}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Token HelloAsso refusé (HTTP ${res.status}).`);
  }

  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error("Réponse token HelloAsso invalide.");
  }
  return json.access_token;
}

// Fetch the organization's membership items and normalize them.
export async function getHelloAssoMembers(): Promise<HelloAssoResult> {
  if (!isHelloAssoConfigured()) {
    return {
      ok: false,
      reason: "not_configured",
      message:
        "Intégration HelloAsso non configurée (définir HELLOASSO_CLIENT_ID, HELLOASSO_CLIENT_SECRET et HELLOASSO_ORGANIZATION_SLUG).",
    };
  }

  try {
    const token = await getAccessToken();
    const slug = process.env.HELLOASSO_ORGANIZATION_SLUG as string;

    const url = new URL(`${apiBase()}/v5/organizations/${slug}/items`);
    url.searchParams.set("itemStates", "Processed");
    url.searchParams.set("pageSize", "100");

    const res = await withTimeout(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        ok: false,
        reason: "error",
        message: `Erreur HelloAsso (HTTP ${res.status}).`,
      };
    }

    const body = (await res.json()) as HelloAssoItemsResponse;
    const members: HelloAssoMember[] = (body.data ?? [])
      .filter((item) => item.type === "Membership")
      .map((item) => ({
        memberId: String(item.id),
        firstName: item.payer?.firstName ?? item.user?.firstName ?? "",
        lastName: item.payer?.lastName ?? item.user?.lastName ?? "",
        email: item.payer?.email,
        state: item.state,
      }));

    return { ok: true, members };
  } catch (error) {
    return {
      ok: false,
      reason: "error",
      message:
        error instanceof Error
          ? error.message
          : "Impossible de contacter l'API HelloAsso.",
    };
  }
}

type HelloAssoItemsResponse = {
  data?: Array<{
    id: number | string;
    type?: string;
    state?: string;
    payer?: { firstName?: string; lastName?: string; email?: string };
    user?: { firstName?: string; lastName?: string };
  }>;
};
