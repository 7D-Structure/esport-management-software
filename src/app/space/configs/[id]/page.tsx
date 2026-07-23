import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { ConfigForm } from "../config-form";
import { deleteConfig, updateConfig } from "../actions";

export default async function EditConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser();
  const { id } = await params;

  const config = await prisma.configFile.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!config) {
    notFound();
  }

  const updateConfigWithId = updateConfig.bind(null, id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{config.name}</h1>
        <div className="flex items-center gap-4 text-sm">
          <a
            href={`/space/configs/${config.id}/download`}
            className="text-neutral-600 hover:underline dark:text-neutral-400"
          >
            Télécharger
          </a>
          <form action={deleteConfig}>
            <input type="hidden" name="id" value={config.id} />
            <button type="submit" className="text-red-600 hover:underline">
              Supprimer
            </button>
          </form>
        </div>
      </div>

      <ConfigForm
        action={updateConfigWithId}
        defaults={config}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
