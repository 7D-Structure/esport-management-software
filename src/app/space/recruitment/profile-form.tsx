import { GAME_LABELS } from "@/lib/labels";
import { GAME_VALUES } from "@/lib/validation";

type ProfileDefaults = {
  game?: string;
  inGameRole?: string | null;
  faceitNickname?: string | null;
  availability?: string | null;
  bio?: string | null;
  lookingForTeam?: boolean;
};

export function ProfileForm({
  action,
  defaults,
}: {
  action: (formData: FormData) => void;
  defaults?: ProfileDefaults;
}) {
  const lookingForTeam = defaults?.lookingForTeam ?? true;

  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
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
        <div className="flex flex-col gap-1">
          <label htmlFor="inGameRole" className="text-sm font-medium">
            Rôle en jeu
          </label>
          <input
            id="inGameRole"
            name="inGameRole"
            placeholder="ex: IGL, AWPer, Support..."
            defaultValue={defaults?.inGameRole ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="faceitNickname" className="text-sm font-medium">
          Pseudo FaceIT
        </label>
        <input
          id="faceitNickname"
          name="faceitNickname"
          placeholder="ex: s1mple"
          defaultValue={defaults?.faceitNickname ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="availability" className="text-sm font-medium">
          Disponibilités
        </label>
        <input
          id="availability"
          name="availability"
          placeholder="ex: soirs en semaine + week-end"
          defaultValue={defaults?.availability ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="bio" className="text-sm font-medium">
          Présentation
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          placeholder="Parlez de votre expérience, vos objectifs..."
          defaultValue={defaults?.bio ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="lookingForTeam"
          defaultChecked={lookingForTeam}
          className="h-4 w-4"
        />
        Je suis à la recherche d&apos;une équipe (visible dans le Player Finder)
      </label>

      <button
        type="submit"
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
      >
        Enregistrer
      </button>
    </form>
  );
}
