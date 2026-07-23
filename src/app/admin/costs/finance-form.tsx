import {
  FINANCE_CATEGORY_LABELS,
  FINANCE_TYPE_LABELS,
} from "@/lib/labels";
import {
  FINANCE_CATEGORY_VALUES,
  FINANCE_TYPE_VALUES,
} from "@/lib/validation";
import { centsToEurosInput } from "@/lib/money";
import { toDateInputValue } from "@/lib/datetime";

type Team = { id: string; name: string };

type FinanceDefaults = {
  label?: string;
  type?: string;
  category?: string;
  amountCents?: number;
  date?: Date;
  notes?: string | null;
  teamId?: string | null;
};

export function FinanceForm({
  action,
  teams,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  teams: Team[];
  defaults?: FinanceDefaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div className="flex flex-col gap-1">
        <label htmlFor="label" className="text-sm font-medium">
          Libellé
        </label>
        <input
          id="label"
          name="label"
          required
          placeholder="ex: Inscription tournoi, achat souris..."
          defaultValue={defaults?.label}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="type" className="text-sm font-medium">
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={defaults?.type ?? "EXPENSE"}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            {FINANCE_TYPE_VALUES.map((type) => (
              <option key={type} value={type}>
                {FINANCE_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-sm font-medium">
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            defaultValue={defaults?.category ?? "OTHER"}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            {FINANCE_CATEGORY_VALUES.map((category) => (
              <option key={category} value={category}>
                {FINANCE_CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="amount" className="text-sm font-medium">
            Montant (€)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
            defaultValue={
              defaults?.amountCents !== undefined
                ? centsToEurosInput(defaults.amountCents)
                : ""
            }
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="text-sm font-medium">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={toDateInputValue(defaults?.date)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="teamId" className="text-sm font-medium">
          Équipe (optionnel)
        </label>
        <select
          id="teamId"
          name="teamId"
          defaultValue={defaults?.teamId ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="">Association / général</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes (optionnel)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={defaults?.notes ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
      >
        {submitLabel}
      </button>
    </form>
  );
}
