import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  GAME_LABELS,
  SERVER_STATUS_COLORS,
  SERVER_STATUS_LABELS,
} from "@/lib/labels";

export default async function ServersPage() {
  const { organization } = await requireAdmin();

  const servers = await prisma.gameServer.findMany({
    where: { organizationId: organization.id },
    orderBy: [{ game: "asc" }, { name: "asc" }],
    include: { team: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Serveurs</h1>
          <p className="text-sm text-neutral-500">
            Inventaire de vos serveurs de jeu et leurs accès.
          </p>
        </div>
        <Link
          href="/admin/servers/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          + Ajouter un serveur
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
            <th className="py-2">Statut</th>
            <th className="py-2">Nom</th>
            <th className="py-2">Jeu</th>
            <th className="py-2">Adresse</th>
            <th className="py-2">Équipe</th>
          </tr>
        </thead>
        <tbody>
          {servers.map((server) => (
            <tr
              key={server.id}
              className="border-b border-neutral-100 hover:bg-neutral-50 dark:border-neutral-900 dark:hover:bg-neutral-900"
            >
              <td className="py-2">
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      SERVER_STATUS_COLORS[server.status] ?? "bg-neutral-400"
                    }`}
                  />
                  <span className="text-neutral-500">
                    {SERVER_STATUS_LABELS[server.status]}
                  </span>
                </span>
              </td>
              <td className="py-2">
                <Link
                  href={`/admin/servers/${server.id}`}
                  className="font-medium hover:underline"
                >
                  {server.name}
                </Link>
              </td>
              <td className="py-2">{GAME_LABELS[server.game]}</td>
              <td className="py-2 font-mono text-xs">
                {server.host}
                {server.port ? `:${server.port}` : ""}
              </td>
              <td className="py-2">{server.team?.name ?? "—"}</td>
            </tr>
          ))}
          {servers.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-neutral-500">
                Aucun serveur pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
