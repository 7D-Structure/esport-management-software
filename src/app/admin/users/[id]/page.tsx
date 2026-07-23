import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/require-admin";
import { UserForm } from "../user-form";
import { deleteUser, updateUser } from "../actions";

export default async function EditUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireSuperAdmin();
  const { id } = await params;
  const { error } = await searchParams;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    notFound();
  }

  const isSelf = user.id === session.user.id;
  const updateUserWithId = updateUser.bind(null, id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        {!isSelf && (
          <form action={deleteUser}>
            <input type="hidden" name="id" value={user.id} />
            <button
              type="submit"
              className="text-sm text-red-600 hover:underline"
            >
              Supprimer le compte
            </button>
          </form>
        )}
      </div>

      {error && (
        <p className="max-w-xl rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {isSelf && (
        <p className="max-w-xl rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-500 dark:border-neutral-800">
          Ceci est votre compte : vous ne pouvez ni changer votre rôle ni vous
          supprimer.
        </p>
      )}

      <UserForm
        action={updateUserWithId}
        defaults={user}
        isNew={false}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
