import { prisma } from "@/lib/prisma";
import { requireSiteAdmin } from "@/lib/require-admin";
import { toDateInputValue } from "@/lib/datetime";

export default async function SiteHomePage() {
  await requireSiteAdmin();

  const [organizations, userCount] = await Promise.all([
    prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { memberships: true, teams: true, players: true },
        },
      },
    }),
    prisma.user.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Organisations</h1>
        <p className="text-sm text-neutral-500">
          {organizations.length} organisation(s) · {userCount} compte(s) sur le
          site.
        </p>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
            <th className="py-2">Nom</th>
            <th className="py-2">Slug</th>
            <th className="py-2">Membres</th>
            <th className="py-2">Équipes</th>
            <th className="py-2">Joueurs</th>
            <th className="py-2">Créée le</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr
              key={org.id}
              className="border-b border-neutral-100 dark:border-neutral-900"
            >
              <td className="py-2 font-medium">{org.name}</td>
              <td className="py-2 font-mono text-xs text-neutral-500">
                {org.slug}
              </td>
              <td className="py-2">{org._count.memberships}</td>
              <td className="py-2">{org._count.teams}</td>
              <td className="py-2">{org._count.players}</td>
              <td className="py-2 text-neutral-500">
                {toDateInputValue(org.createdAt)}
              </td>
            </tr>
          ))}
          {organizations.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-neutral-500">
                Aucune organisation pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
