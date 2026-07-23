import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { INVITATION_STATUS_COLORS, INVITATION_STATUS_LABELS } from "@/lib/labels";
import { respondInvitation } from "../actions";

export default async function InvitationsPage() {
  const session = await requireUser();

  const invitations = await prisma.invitation.findMany({
    where: { toUserId: session.user.id },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      roster: { select: { name: true, roleNeeded: true } },
      fromUser: { select: { name: true } },
    },
  });

  const acceptInvitation = respondInvitation;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Mes invitations</h1>
        <p className="text-sm text-neutral-500">
          Invitations reçues des équipes qui souhaitent vous recruter.
        </p>
      </div>

      <ul className="space-y-3">
        {invitations.map((inv) => (
          <li
            key={inv.id}
            className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-medium">{inv.roster.name}</span>
              <span className="inline-flex items-center gap-2 text-xs text-neutral-500">
                <span
                  className={`h-2 w-2 rounded-full ${
                    INVITATION_STATUS_COLORS[inv.status]
                  }`}
                />
                {INVITATION_STATUS_LABELS[inv.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-500">
              Invité par {inv.fromUser.name}
              {inv.roster.roleNeeded ? ` · rôle : ${inv.roster.roleNeeded}` : ""}
            </p>
            {inv.message && (
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                « {inv.message} »
              </p>
            )}

            {inv.status === "PENDING" && (
              <div className="mt-3 flex gap-2">
                <form action={acceptInvitation.bind(null, inv.id, true)}>
                  <button
                    type="submit"
                    className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
                  >
                    Accepter
                  </button>
                </form>
                <form action={acceptInvitation.bind(null, inv.id, false)}>
                  <button
                    type="submit"
                    className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
                  >
                    Refuser
                  </button>
                </form>
              </div>
            )}
          </li>
        ))}
        {invitations.length === 0 && (
          <li className="rounded-lg border border-neutral-200 px-4 py-6 text-center text-sm text-neutral-500 dark:border-neutral-800">
            Aucune invitation pour le moment.
          </li>
        )}
      </ul>
    </div>
  );
}
