import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { GOAL_STATUS_COLORS, GOAL_STATUS_LABELS } from "@/lib/labels";
import { toDateInputValue } from "@/lib/datetime";
import { setGoalStatus } from "./actions";

export default async function GoalsPage() {
  const session = await requireUser();

  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mes objectifs</h1>
          <p className="text-sm text-neutral-500">
            Suivez la progression de vos objectifs personnels.
          </p>
        </div>
        <Link
          href="/space/goals/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          + Nouvel objectif
        </Link>
      </div>

      <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 dark:divide-neutral-900 dark:border-neutral-800">
        {goals.map((goal) => (
          <li
            key={goal.id}
            className="flex items-center gap-3 px-4 py-3"
          >
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                GOAL_STATUS_COLORS[goal.status] ?? "bg-neutral-400"
              }`}
            />
            <Link
              href={`/space/goals/${goal.id}`}
              className="min-w-0 flex-1 hover:underline"
            >
              <span
                className={`font-medium ${
                  goal.status === "DONE"
                    ? "text-neutral-400 line-through"
                    : ""
                }`}
              >
                {goal.title}
              </span>
              {goal.targetDate && (
                <span className="ml-2 text-xs text-neutral-500">
                  échéance {toDateInputValue(goal.targetDate)}
                </span>
              )}
            </Link>
            <form action={setGoalStatus} className="shrink-0">
              <input type="hidden" name="id" value={goal.id} />
              <select
                name="status"
                defaultValue={goal.status}
                className="rounded-md border border-neutral-300 px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-900"
              >
                {Object.entries(GOAL_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="ml-2 text-xs text-neutral-600 hover:underline dark:text-neutral-400"
              >
                Mettre à jour
              </button>
            </form>
          </li>
        ))}
        {goals.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-neutral-500">
            Aucun objectif pour le moment.
          </li>
        )}
      </ul>
    </div>
  );
}
