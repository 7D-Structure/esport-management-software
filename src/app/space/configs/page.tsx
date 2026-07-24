import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { GAME_LABELS } from "@/lib/labels";

export default async function ConfigsPage() {
  const session = await requireUser();

  const configs = await prisma.configFile.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mes configs</h1>
          <p className="text-sm text-neutral-500">
            Stockez et téléchargez vos fichiers de configuration.
          </p>
        </div>
        <Link
          href="/space/configs/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          + Nouvelle config
        </Link>
      </div>

      <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 dark:divide-neutral-900 dark:border-neutral-800">
        {configs.map((config) => (
          <li
            key={config.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <Link
              href={`/space/configs/${config.id}`}
              className="min-w-0 flex-1 hover:underline"
            >
              <span className="font-medium">{config.name}</span>
              <span className="ml-2 text-xs text-neutral-500">
                {GAME_LABELS[config.game]}
              </span>
            </Link>
            <a
              href={`/space/configs/${config.id}/download`}
              className="shrink-0 text-sm text-neutral-600 hover:underline dark:text-neutral-400"
            >
              Télécharger
            </a>
          </li>
        ))}
        {configs.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-neutral-500">
            Aucune config pour le moment.
          </li>
        )}
      </ul>
    </div>
  );
}
