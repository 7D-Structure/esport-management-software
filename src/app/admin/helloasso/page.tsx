import { requireAdmin } from "@/lib/require-admin";
import { isHelloAssoConfigured } from "@/lib/helloasso";
import { syncHelloAssoMembers } from "./actions";

export default async function HelloAssoPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    error?: string;
  }>;
}) {
  await requireAdmin();

  const { created, updated, error } = await searchParams;
  const configured = isHelloAssoConfigured();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Synchronisation HelloAsso</h1>
        <p className="text-sm text-neutral-500">
          Importez vos adhérents HelloAsso comme joueurs (licences).
        </p>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {(created !== undefined || updated !== undefined) && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
          Synchronisation terminée : {created ?? 0} créé(s), {updated ?? 0} mis à
          jour.
        </p>
      )}

      {!configured ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          <p className="font-medium">Intégration non configurée</p>
          <p className="mt-1">
            Définissez les variables d&apos;environnement suivantes pour activer
            la synchronisation :
          </p>
          <ul className="mt-2 list-inside list-disc font-mono text-xs">
            <li>HELLOASSO_CLIENT_ID</li>
            <li>HELLOASSO_CLIENT_SECRET</li>
            <li>HELLOASSO_ORGANIZATION_SLUG</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            L&apos;intégration est configurée. La synchronisation récupère les
            adhésions HelloAsso et crée ou met à jour les joueurs correspondants
            (association par identifiant HelloAsso).
          </p>
          <form action={syncHelloAssoMembers}>
            <button
              type="submit"
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
            >
              Synchroniser maintenant
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
