import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSiteAdmin } from "@/lib/require-admin";
import { USER_ROLE_LABELS } from "@/lib/labels";
import { toggleSiteAdmin } from "../actions";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireSiteAdmin();
  const { error } = await searchParams;

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    include: {
      player: { select: { id: true } },
      staff: { select: { id: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Comptes</h1>
          <p className="text-sm text-neutral-500">
            Gérez les comptes utilisateurs et leurs rôles.
          </p>
        </div>
        <Link
          href="/site/users/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          + Nouveau compte
        </Link>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
            <th className="py-2">Nom</th>
            <th className="py-2">Email</th>
            <th className="py-2">Rôle</th>
            <th className="py-2">Profil lié</th>
            <th className="py-2">Admin site</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user.id === session.user.id;
            return (
              <tr
                key={user.id}
                className="border-b border-neutral-100 hover:bg-neutral-50 dark:border-neutral-900 dark:hover:bg-neutral-900"
              >
                <td className="py-2">
                  <Link
                    href={`/site/users/${user.id}`}
                    className="font-medium hover:underline"
                  >
                    {user.name}
                  </Link>
                  {isSelf && (
                    <span className="ml-2 text-xs text-neutral-500">(vous)</span>
                  )}
                </td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">{USER_ROLE_LABELS[user.role]}</td>
                <td className="py-2 text-neutral-500">
                  {user.player ? "Joueur" : user.staff ? "Staff" : "—"}
                </td>
                <td className="py-2">
                  <form action={toggleSiteAdmin}>
                    <input type="hidden" name="userId" value={user.id} />
                    <input
                      type="hidden"
                      name="makeAdmin"
                      value={(!user.isSiteAdmin).toString()}
                    />
                    <button
                      type="submit"
                      disabled={isSelf && user.isSiteAdmin}
                      className={`text-xs hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60 ${
                        user.isSiteAdmin
                          ? "text-emerald-600"
                          : "text-neutral-500"
                      }`}
                    >
                      {user.isSiteAdmin ? "Oui — révoquer" : "Non — promouvoir"}
                    </button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
