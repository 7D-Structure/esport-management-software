import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 px-8 py-32 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Esport Management Software
        </h1>
        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Espace Administration (joueurs, staff, licences, statistiques,
          coûts, serveurs, agenda, documents) et Espace Joueur/Coach
          (configurations, objectifs, notebook, agenda) pour votre structure
          esport.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Créer un compte
          </Link>
          <Link
            href="/enter"
            className="flex h-12 items-center justify-center rounded-full border border-black/[.12] px-6 transition-colors hover:bg-black/[.04] dark:border-white/[.16] dark:hover:bg-white/[.06]"
          >
            Accéder à mon espace
          </Link>
        </div>
      </main>
    </div>
  );
}
