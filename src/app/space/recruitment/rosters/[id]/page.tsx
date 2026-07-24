import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { INVITATION_STATUS_COLORS, INVITATION_STATUS_LABELS } from "@/lib/labels";
import { RosterForm } from "../../roster-form";
import { deleteRoster, removeMember, updateRoster } from "../../actions";

export default async function ManageRosterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser();
  const { id } = await params;

  const roster = await prisma.roster.findFirst({
    where: { id, ownerId: session.user.id },
    include: {
      memberships: {
        orderBy: { joinedAt: "asc" },
        include: { user: { select: { name: true } } },
      },
      invitations: {
        orderBy: { createdAt: "desc" },
        include: { toUser: { select: { name: true } } },
      },
    },
  });

  if (!roster) {
    notFound();
  }

  const updateRosterWithId = updateRoster.bind(null, id);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{roster.name}</h1>
          <p className="text-sm text-neutral-500">
            <Link
              href="/space/recruitment/players"
              className="hover:underline"
            >
              Inviter des joueurs depuis le Player Finder →
            </Link>
          </p>
        </div>
        <form action={deleteRoster}>
          <input type="hidden" name="id" value={roster.id} />
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Supprimer l&apos;équipe
          </button>
        </form>
      </div>

      <section className="max-w-2xl space-y-4">
        <h2 className="text-lg font-semibold">Membres</h2>
        <ul className="space-y-2">
          {roster.memberships.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800"
            >
              <span>
                <span className="font-medium">{m.user.name}</span>
                {m.role ? (
                  <span className="ml-2 text-xs text-neutral-500">
                    {m.role}
                  </span>
                ) : null}
                {m.userId === roster.ownerId && (
                  <span className="ml-2 text-xs text-neutral-500">
                    (vous)
                  </span>
                )}
              </span>
              {m.userId !== roster.ownerId && (
                <form action={removeMember}>
                  <input type="hidden" name="membershipId" value={m.id} />
                  <input type="hidden" name="rosterId" value={roster.id} />
                  <button
                    type="submit"
                    className="text-red-600 hover:underline"
                  >
                    Retirer
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-2xl space-y-4">
        <h2 className="text-lg font-semibold">Invitations envoyées</h2>
        <ul className="space-y-2">
          {roster.invitations.map((inv) => (
            <li
              key={inv.id}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800"
            >
              <span className="font-medium">{inv.toUser.name}</span>
              <span className="inline-flex items-center gap-2 text-neutral-500">
                <span
                  className={`h-2 w-2 rounded-full ${
                    INVITATION_STATUS_COLORS[inv.status]
                  }`}
                />
                {INVITATION_STATUS_LABELS[inv.status]}
              </span>
            </li>
          ))}
          {roster.invitations.length === 0 && (
            <li className="text-sm text-neutral-500">
              Aucune invitation envoyée.
            </li>
          )}
        </ul>
      </section>

      <section className="max-w-2xl space-y-4">
        <h2 className="text-lg font-semibold">Paramètres de l&apos;équipe</h2>
        <RosterForm
          action={updateRosterWithId}
          defaults={roster}
          submitLabel="Enregistrer"
        />
      </section>
    </div>
  );
}
