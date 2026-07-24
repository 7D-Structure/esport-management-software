import { GAME_LABELS, SERVER_STATUS_LABELS } from "@/lib/labels";
import { GAME_VALUES, SERVER_STATUS_VALUES } from "@/lib/validation";

type Team = { id: string; name: string };

type ServerDefaults = {
  name?: string;
  game?: string;
  status?: string;
  host?: string;
  port?: number | null;
  serverPassword?: string | null;
  rconPassword?: string | null;
  provider?: string | null;
  location?: string | null;
  notes?: string | null;
  teamId?: string | null;
};

export function ServerForm({
  action,
  teams,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  teams: Team[];
  defaults?: ServerDefaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nom
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="ex: Serveur scrim #1"
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

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 flex flex-col gap-1">
          <label htmlFor="host" className="text-sm font-medium">
            Hôte (IP ou domaine)
          </label>
          <input
            id="host"
            name="host"
            required
            placeholder="ex: 51.83.12.34"
            defaultValue={defaults?.host}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="port" className="text-sm font-medium">
            Port
          </label>
          <input
            id="port"
            name="port"
            type="number"
            min="1"
            max="65535"
            placeholder="27015"
            defaultValue={defaults?.port ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium">
            Statut
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaults?.status ?? "UNKNOWN"}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            {SERVER_STATUS_VALUES.map((status) => (
              <option key={status} value={status}>
                {SERVER_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
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
            <option value="">Aucune</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="serverPassword" className="text-sm font-medium">
            Mot de passe serveur{" "}
            <span className="font-normal text-neutral-500">
              {defaults?.serverPassword
                ? "(défini — laisser vide pour conserver)"
                : "(optionnel)"}
            </span>
          </label>
          <input
            id="serverPassword"
            name="serverPassword"
            type="password"
            autoComplete="off"
            placeholder={defaults?.serverPassword ? "••••••••" : ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="rconPassword" className="text-sm font-medium">
            Mot de passe RCON{" "}
            <span className="font-normal text-neutral-500">
              {defaults?.rconPassword
                ? "(défini — laisser vide pour conserver)"
                : "(optionnel)"}
            </span>
          </label>
          <input
            id="rconPassword"
            name="rconPassword"
            type="password"
            autoComplete="off"
            placeholder={defaults?.rconPassword ? "••••••••" : ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="provider" className="text-sm font-medium">
            Hébergeur (optionnel)
          </label>
          <input
            id="provider"
            name="provider"
            placeholder="ex: OVH, GPORTAL..."
            defaultValue={defaults?.provider ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="location" className="text-sm font-medium">
            Localisation (optionnel)
          </label>
          <input
            id="location"
            name="location"
            placeholder="ex: Paris, Francfort..."
            defaultValue={defaults?.location ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
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
