import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { canManageOrg } from "@/lib/org";
import { ORG_ROLE_LABELS } from "@/lib/labels";
import { ORG_ROLE_VALUES } from "@/lib/validation";
import { addMember, changeMemberRole, removeMember } from "./actions";

const ASSIGNABLE_ROLES = ORG_ROLE_VALUES.filter((r) => r !== "OWNER");

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { organization, membership, session } = await requireAdmin();
  if (!canManageOrg(membership.role)) {
    redirect("/admin/players");
  }
  const { error } = await searchParams;

  const members = await prisma.organizationMembership.findMany({
    where: { organizationId: organization.id },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Membres de {organization.name}</h1>
        <p className="text-sm text-neutral-500">
          Gérez qui peut administrer votre organisation et leur rôle.
        </p>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <form
        action={addMember}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email du compte à ajouter
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="membre@example.com"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="text-sm font-medium">
            Rôle
          </label>
          <select
            id="role"
            name="role"
            defaultValue="STAFF"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            {ASSIGNABLE_ROLES.map((role) => (
              <option key={role} value={role}>
                {ORG_ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Ajouter
        </button>
      </form>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
            <th className="py-2">Nom</th>
            <th className="py-2">Email</th>
            <th className="py-2">Rôle</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {members.map((m) => {
            const isOwner = m.role === "OWNER";
            const isSelf = m.userId === session.user.id;
            return (
              <tr
                key={m.id}
                className="border-b border-neutral-100 dark:border-neutral-900"
              >
                <td className="py-2 font-medium">
                  {m.user.name}
                  {isSelf && (
                    <span className="ml-2 text-xs text-neutral-500">(vous)</span>
                  )}
                </td>
                <td className="py-2">{m.user.email}</td>
                <td className="py-2">
                  {isOwner ? (
                    ORG_ROLE_LABELS[m.role]
                  ) : (
                    <form
                      action={changeMemberRole}
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="membershipId" value={m.id} />
                      <select
                        name="role"
                        defaultValue={m.role}
                        className="rounded-md border border-neutral-300 px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-900"
                      >
                        {ASSIGNABLE_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {ORG_ROLE_LABELS[role]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="text-xs text-neutral-600 hover:underline dark:text-neutral-400"
                      >
                        Modifier
                      </button>
                    </form>
                  )}
                </td>
                <td className="py-2 text-right">
                  {!isOwner && (
                    <form action={removeMember}>
                      <input type="hidden" name="membershipId" value={m.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:underline"
                      >
                        Retirer
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
