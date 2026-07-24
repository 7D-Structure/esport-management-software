import { requireUser } from "@/lib/require-user";
import { deleteAccount } from "./actions";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireUser();
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Mon compte</h1>
        <p className="text-sm text-neutral-500">
          {session.user.name} · {session.user.email}
        </p>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <section className="space-y-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
        <h2 className="text-lg font-semibold">Mes données</h2>
        <p className="text-sm text-neutral-500">
          Téléchargez l&apos;ensemble des données associées à votre compte
          (profil, configs, objectifs, notes, équipes, invitations…) au format
          JSON.
        </p>
        <a
          href="/space/account/export"
          className="inline-flex rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          Télécharger mes données
        </a>
      </section>

      <section className="space-y-3 rounded-lg border border-red-200 p-4 dark:border-red-900">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
          Supprimer mon compte
        </h2>
        <p className="text-sm text-neutral-500">
          Cette action est <strong>irréversible</strong>. Votre compte et vos
          données personnelles (profil de recherche d&apos;équipe, configs,
          objectifs, notes, équipes que vous gérez seul, adhésions et
          invitations) seront définitivement supprimés. Les organisations que
          vous partagez avec d&apos;autres membres doivent d&apos;abord être
          transférées ou supprimées.
        </p>
        <form action={deleteAccount} className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="confirm" className="text-sm font-medium">
              Tapez <span className="font-mono">SUPPRIMER</span> pour confirmer
            </label>
            <input
              id="confirm"
              name="confirm"
              autoComplete="off"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Supprimer définitivement
          </button>
        </form>
      </section>
    </div>
  );
}
