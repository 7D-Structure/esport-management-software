import Link from "next/link";
import { requireUser } from "@/lib/require-user";
import { createOrganization } from "./actions";

export default async function NewOrganizationPage() {
  await requireUser();

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        action={createOrganization}
        className="w-full max-w-md space-y-4 rounded-lg border border-neutral-200 p-6 dark:border-neutral-800"
      >
        <div>
          <h1 className="text-xl font-semibold">Créer une organisation</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Créez l&apos;espace de gestion de votre association / club. Vous en
            serez le propriétaire.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nom de l&apos;organisation
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="ex: Association Esport Lyon"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Créer et accéder à l&apos;administration
        </button>

        <p className="text-center text-sm text-neutral-500">
          <Link href="/space" className="underline">
            Retour à mon espace
          </Link>
        </p>
      </form>
    </div>
  );
}
