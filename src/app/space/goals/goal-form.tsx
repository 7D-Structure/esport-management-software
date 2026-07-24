import { GOAL_STATUS_LABELS } from "@/lib/labels";
import { GOAL_STATUS_VALUES } from "@/lib/validation";
import { toDateInputValue } from "@/lib/datetime";

type GoalDefaults = {
  title?: string;
  description?: string | null;
  targetDate?: Date | null;
  status?: string;
};

export function GoalForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaults?: GoalDefaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          Titre
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="ex: Atteindre le rang Supreme"
          defaultValue={defaults?.title}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium">
            Statut
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaults?.status ?? "TODO"}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            {GOAL_STATUS_VALUES.map((status) => (
              <option key={status} value={status}>
                {GOAL_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="targetDate" className="text-sm font-medium">
            Échéance (optionnel)
          </label>
          <input
            id="targetDate"
            name="targetDate"
            type="date"
            defaultValue={toDateInputValue(defaults?.targetDate)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description (optionnel)
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaults?.description ?? ""}
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
