import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  FINANCE_CATEGORY_LABELS,
  FINANCE_TYPE_LABELS,
} from "@/lib/labels";
import { formatCents, formatSignedCents } from "@/lib/money";
import { toDateInputValue } from "@/lib/datetime";

export default async function CostsPage() {
  await requireAdmin();

  const [entries, totals] = await Promise.all([
    prisma.financeEntry.findMany({
      orderBy: { date: "desc" },
      include: { team: true },
    }),
    prisma.financeEntry.groupBy({
      by: ["type"],
      _sum: { amountCents: true },
    }),
  ]);

  const incomeCents =
    totals.find((t) => t.type === "INCOME")?._sum.amountCents ?? 0;
  const expenseCents =
    totals.find((t) => t.type === "EXPENSE")?._sum.amountCents ?? 0;
  const balanceCents = incomeCents - expenseCents;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestion des coûts</h1>
          <p className="text-sm text-neutral-500">
            Suivez les dépenses et recettes de votre structure.
          </p>
        </div>
        <Link
          href="/admin/costs/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          + Nouvelle entrée
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="text-sm text-neutral-500">Recettes</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-600">
            {formatCents(incomeCents)}
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="text-sm text-neutral-500">Dépenses</div>
          <div className="mt-1 text-2xl font-semibold text-red-600">
            {formatCents(expenseCents)}
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="text-sm text-neutral-500">Solde</div>
          <div
            className={`mt-1 text-2xl font-semibold ${
              balanceCents >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {formatSignedCents(balanceCents)}
          </div>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
            <th className="py-2">Date</th>
            <th className="py-2">Libellé</th>
            <th className="py-2">Catégorie</th>
            <th className="py-2">Équipe</th>
            <th className="py-2 text-right">Montant</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isIncome = entry.type === "INCOME";
            return (
              <tr
                key={entry.id}
                className="border-b border-neutral-100 hover:bg-neutral-50 dark:border-neutral-900 dark:hover:bg-neutral-900"
              >
                <td className="py-2 whitespace-nowrap text-neutral-500">
                  {toDateInputValue(entry.date)}
                </td>
                <td className="py-2">
                  <Link
                    href={`/admin/costs/${entry.id}`}
                    className="font-medium hover:underline"
                  >
                    {entry.label}
                  </Link>
                </td>
                <td className="py-2">
                  {FINANCE_CATEGORY_LABELS[entry.category]}
                </td>
                <td className="py-2">
                  {entry.team?.name ?? "Général"}
                </td>
                <td
                  className={`py-2 text-right font-medium whitespace-nowrap ${
                    isIncome ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {isIncome ? "+" : "−"}
                  {formatCents(entry.amountCents)}
                  <span className="ml-2 text-xs font-normal text-neutral-400">
                    {FINANCE_TYPE_LABELS[entry.type]}
                  </span>
                </td>
              </tr>
            );
          })}
          {entries.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-neutral-500">
                Aucune entrée pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
