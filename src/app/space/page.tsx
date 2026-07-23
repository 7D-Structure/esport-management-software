import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

const CARDS = [
  {
    href: "/space/configs",
    title: "Mes configs",
    description: "Stockez et téléchargez vos fichiers .cfg.",
  },
  {
    href: "/space/goals",
    title: "Mes objectifs",
    description: "Planifiez et suivez vos objectifs personnels.",
  },
  {
    href: "/space/notebook",
    title: "Mon notebook",
    description: "Vos notes personnelles au même endroit.",
  },
];

export default async function SpaceHomePage() {
  const session = await requireUser();
  const userId = session.user.id;

  const [configCount, goalCount, noteCount] = await Promise.all([
    prisma.configFile.count({ where: { userId } }),
    prisma.goal.count({ where: { userId, status: { not: "DONE" } } }),
    prisma.note.count({ where: { userId } }),
  ]);

  const counts: Record<string, number> = {
    "/space/configs": configCount,
    "/space/goals": goalCount,
    "/space/notebook": noteCount,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Bonjour {session.user.name}
        </h1>
        <p className="text-sm text-neutral-500">
          Bienvenue dans votre espace personnel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="font-medium">{card.title}</h2>
              <span className="text-2xl font-semibold">
                {counts[card.href]}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-500">{card.description}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
        <h2 className="font-medium">Gérer une équipe / association ?</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Créez votre organisation pour gérer joueurs, staff, agenda, coûts et
          plus.
        </p>
        <Link
          href="/onboarding/organization"
          className="mt-3 inline-flex rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Créer une organisation
        </Link>
      </div>
    </div>
  );
}
