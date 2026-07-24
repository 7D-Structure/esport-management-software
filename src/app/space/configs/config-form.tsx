import { GAME_LABELS } from "@/lib/labels";
import { GAME_VALUES } from "@/lib/validation";

type ConfigDefaults = {
  name?: string;
  game?: string;
  content?: string;
};

export function ConfigForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaults?: ConfigDefaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nom
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="ex: autoexec.cfg"
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
            defaultValue={defaults?.game ?? GAME_VALUES[0]}
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

      <div className="flex flex-col gap-1">
        <label htmlFor="content" className="text-sm font-medium">
          Contenu
        </label>
        <textarea
          id="content"
          name="content"
          rows={16}
          spellCheck={false}
          placeholder="// Collez le contenu de votre .cfg ici"
          defaultValue={defaults?.content}
          className="rounded-md border border-neutral-300 px-3 py-2 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-900"
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
