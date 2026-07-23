import { GAME_LABELS } from "@/lib/labels";
import { GAME_VALUES } from "@/lib/validation";

type RosterDefaults = {
  name?: string;
  game?: string;
  description?: string | null;
  roleNeeded?: string | null;
  minFaceitLevel?: number | null;
  recruiting?: boolean;
};

export function RosterForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaults?: RosterDefaults;
  submitLabel: string;
}) {
  const recruiting = defaults?.recruiting ?? true;

  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nom de l&apos;équipe
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="ex: Team Nova"
            defaultValue={defaults?.name}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="game" className="text-sm font-medium">
            Jeu
          </label>
          <select
            id="game"
            name="game"
            defaultValue={defaults?.game ?? "CS2"}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            {GAME_VALUES.map((game) => (
              <option key={game} value={game}>
                {GAME_LABELS[game]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="roleNeeded" className="text-sm font-medium">
            Rôle recherché (optionnel)
          </label>
          <input
            id="roleNeeded"
            name="roleNeeded"
            placeholder="ex: AWPer"
            defaultValue={defaults?.roleNeeded ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="minFaceitLevel" className="text-sm font-medium">
            Niveau FaceIT min (optionnel)
          </label>
          <input
            id="minFaceitLevel"
            name="minFaceitLevel"
            type="number"
            min="1"
            max="10"
            placeholder="1-10"
            defaultValue={defaults?.minFaceitLevel ?? ""}
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
          placeholder="Ambitions, rythme d'entraînement, ce que vous cherchez..."
          defaultValue={defaults?.description ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="recruiting"
          defaultChecked={recruiting}
          className="h-4 w-4"
        />
        L&apos;équipe recrute (visible dans le Team Finder)
      </label>

      <button
        type="submit"
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
      >
        {submitLabel}
      </button>
    </form>
  );
}
