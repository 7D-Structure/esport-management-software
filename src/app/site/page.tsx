import { prisma } from "@/lib/prisma";
import { requireSiteAdmin } from "@/lib/require-admin";
import { toDateInputValue } from "@/lib/datetime";
import { createOrganizationForOwner, deleteOrganization } from "./actions";

export default async function SiteHomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireSiteAdmin();
  const { error } = await searchParams;

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

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <form
        action={createOrganizationForOwner}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nouvelle organisation
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Nom"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ownerEmail" className="text-sm font-medium">
            Email du propriétaire
          </label>
          <input
            id="ownerEmail"
            name="ownerEmail"
            type="email"
            required
            placeholder="owner@example.com"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Créer
        </button>
      </form>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
            <th className="py-2">Nom</th>
            <th className="py-2">Slug</th>
            <th className="py-2">Membres</th>
            <th className="py-2">Équipes</th>
            <th className="py-2">Joueurs</th>
            <th className="py-2">Créée le</th>
            <th className="py-2" />
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
              <td className="py-2 text-right">
                <form action={deleteOrganization}>
                  <input type="hidden" name="id" value={org.id} />
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
          {organizations.length === 0 && (
            <tr>
              <td colSpan={7} className="py-6 text-center text-neutral-500">
                Aucune organisation pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
