import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { decryptSecret } from "@/lib/crypto";
import { ServerForm } from "../server-form";
import { deleteServer, updateServer } from "../actions";

// The in-game console command to join a Source/Source 2 server (CS2, ...).
function buildConnectCommand(
  host: string,
  port: number | null,
  serverPassword: string | null,
): string {
  const address = port ? `${host}:${port}` : host;
  const base = `connect ${address}`;
  return serverPassword ? `${base}; password ${serverPassword}` : base;
}

const SOURCE_GAMES = new Set(["CS2"]);

export default async function EditServerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { organization } = await requireAdmin();
  const { id } = await params;

  const [server, teams] = await Promise.all([
    prisma.gameServer.findFirst({
      where: { id, organizationId: organization.id },
    }),
    prisma.team.findMany({
      where: { organizationId: organization.id },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!server) {
    notFound();
  }

  const updateServerWithId = updateServer.bind(null, id);
  const showConnectCommand = SOURCE_GAMES.has(server.game);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{server.name}</h1>
        <form action={deleteServer}>
          <input type="hidden" name="id" value={server.id} />
          <button
            type="submit"
            className="text-sm text-red-600 hover:underline"
          >
            Supprimer le serveur
          </button>
        </form>
      </div>

      {showConnectCommand && (
        <section className="max-w-2xl space-y-2">
          <h2 className="text-sm font-medium text-neutral-500">
            Commande de connexion (console)
          </h2>
          <pre className="overflow-x-auto rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-sm dark:border-neutral-800 dark:bg-neutral-900">
            {buildConnectCommand(
              server.host,
              server.port,
              decryptSecret(server.serverPassword),
            )}
          </pre>
        </section>
      )}

      <ServerForm
        action={updateServerWithId}
        teams={teams}
        defaults={server}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
