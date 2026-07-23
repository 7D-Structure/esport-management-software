import { requireSuperAdmin } from "@/lib/require-admin";
import { createUser } from "../actions";
import { UserForm } from "../user-form";

export default async function NewUserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireSuperAdmin();
  const { error } = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nouveau compte</h1>
      </div>
      {error && (
        <p className="max-w-xl rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      <UserForm action={createUser} isNew submitLabel="Créer" />
    </div>
  );
}
