import {
  GAME_LABELS,
  LICENSE_STATUS_LABELS,
} from "@/lib/labels";
import { GAME_VALUES, LICENSE_STATUS_VALUES } from "@/lib/validation";
import { toDateInputValue } from "@/lib/datetime";

type Team = { id: string; name: string };

type PlayerDefaults = {
  firstName?: string;
  lastName?: string;
  gamertag?: string;
  game?: string;
  inGameRole?: string | null;
  faceitNickname?: string | null;
  dateOfBirth?: Date | null;
  licenseNumber?: string | null;
  licenseStatus?: string;
  licenseExpiresAt?: Date | null;
  teamId?: string | null;
};

export function PlayerForm({
  action,
  teams,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  teams: Team[];
  defaults?: PlayerDefaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="firstName" className="text-sm font-medium">
            Prénom
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            defaultValue={defaults?.firstName}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lastName" className="text-sm font-medium">
            Nom
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            defaultValue={defaults?.lastName}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="gamertag" className="text-sm font-medium">
            Pseudo
          </label>
          <input
            id="gamertag"
            name="gamertag"
            required
            defaultValue={defaults?.gamertag}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="inGameRole" className="text-sm font-medium">
            Rôle en jeu
          </label>
          <input
            id="inGameRole"
            name="inGameRole"
            placeholder="ex: IGL, Support, AWPer..."
            defaultValue={defaults?.inGameRole ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="faceitNickname" className="text-sm font-medium">
          Pseudo FaceIT (pour les stats CS2)
        </label>
        <input
          id="faceitNickname"
          name="faceitNickname"
          placeholder="ex: s1mple"
          defaultValue={defaults?.faceitNickname ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="game" className="text-sm font-medium">
            Jeu
          </label>
          <select
            id="game"
            name="game"
            required
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
        <div className="flex flex-col gap-1">
          <label htmlFor="teamId" className="text-sm font-medium">
            Équipe
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

      <div className="flex flex-col gap-1">
        <label htmlFor="dateOfBirth" className="text-sm font-medium">
          Date de naissance
        </label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          defaultValue={toDateInputValue(defaults?.dateOfBirth)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <fieldset className="space-y-4 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
        <legend className="px-1 text-sm font-medium">Licence</legend>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="licenseNumber" className="text-sm font-medium">
              Numéro
            </label>
            <input
              id="licenseNumber"
              name="licenseNumber"
              defaultValue={defaults?.licenseNumber ?? ""}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="licenseStatus" className="text-sm font-medium">
              Statut
            </label>
            <select
              id="licenseStatus"
              name="licenseStatus"
              defaultValue={defaults?.licenseStatus ?? "NONE"}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              {LICENSE_STATUS_VALUES.map((status) => (
                <option key={status} value={status}>
                  {LICENSE_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="licenseExpiresAt" className="text-sm font-medium">
              Expire le
            </label>
            <input
              id="licenseExpiresAt"
              name="licenseExpiresAt"
              type="date"
              defaultValue={toDateInputValue(defaults?.licenseExpiresAt)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
        </div>
      </fieldset>

      <button
        type="submit"
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
      >
        {submitLabel}
      </button>
    </form>
  );
}
