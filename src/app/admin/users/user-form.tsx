import { USER_ROLE_LABELS } from "@/lib/labels";
import { USER_ROLE_VALUES } from "@/lib/validation";

type UserDefaults = {
  name?: string;
  email?: string;
  role?: string;
};

export function UserForm({
  action,
  defaults,
  isNew,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaults?: UserDefaults;
  isNew: boolean;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nom
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={defaults?.name}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="text-sm font-medium">
            Rôle
          </label>
          <select
            id="role"
            name="role"
            defaultValue={defaults?.role ?? "PLAYER"}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            {USER_ROLE_VALUES.map((role) => (
              <option key={role} value={role}>
                {USER_ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={defaults?.email}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Mot de passe
          {!isNew && (
            <span className="ml-1 font-normal text-neutral-500">
              (laisser vide pour ne pas changer)
            </span>
          )}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required={isNew}
          minLength={8}
          autoComplete="new-password"
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
