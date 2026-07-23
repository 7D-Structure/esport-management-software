import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import { canManageOrg } from "@/lib/org";
import { updateIntegrations } from "./actions";

export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { organization, membership } = await requireAdmin();
  if (!canManageOrg(membership.role)) {
    redirect("/admin/players");
  }
  const { saved } = await searchParams;

  const faceitSet = Boolean(organization.faceitApiKey);
  const secretSet = Boolean(organization.helloAssoClientSecret);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Intégrations</h1>
        <p className="text-sm text-neutral-500">
          Identifiants d&apos;API propres à {organization.name}. Ils prennent le
          pas sur la configuration globale du serveur.
        </p>
      </div>

      {saved && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
          Paramètres enregistrés.
        </p>
      )}

      <form action={updateIntegrations} className="space-y-8">
        <fieldset className="space-y-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <legend className="px-1 text-sm font-medium">FaceIT (stats CS2)</legend>
          <div className="flex flex-col gap-1">
            <label htmlFor="faceitApiKey" className="text-sm font-medium">
              Clé API FaceIT{" "}
              {faceitSet && (
                <span className="font-normal text-neutral-500">
                  (définie — laisser vide pour conserver)
                </span>
              )}
            </label>
            <input
              id="faceitApiKey"
              name="faceitApiKey"
              type="password"
              autoComplete="off"
              placeholder={faceitSet ? "••••••••" : "Clé Data API FaceIT"}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <legend className="px-1 text-sm font-medium">
            HelloAsso (adhésions)
          </legend>
          <div className="flex flex-col gap-1">
            <label htmlFor="helloAssoClientId" className="text-sm font-medium">
              Client ID
            </label>
            <input
              id="helloAssoClientId"
              name="helloAssoClientId"
              autoComplete="off"
              defaultValue={organization.helloAssoClientId ?? ""}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="helloAssoClientSecret"
              className="text-sm font-medium"
            >
              Client Secret{" "}
              {secretSet && (
                <span className="font-normal text-neutral-500">
                  (défini — laisser vide pour conserver)
                </span>
              )}
            </label>
            <input
              id="helloAssoClientSecret"
              name="helloAssoClientSecret"
              type="password"
              autoComplete="off"
              placeholder={secretSet ? "••••••••" : ""}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="helloAssoOrgSlug" className="text-sm font-medium">
              Slug de l&apos;organisation HelloAsso
            </label>
            <input
              id="helloAssoOrgSlug"
              name="helloAssoOrgSlug"
              autoComplete="off"
              placeholder="mon-asso"
              defaultValue={organization.helloAssoOrgSlug ?? ""}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
        </fieldset>

        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
