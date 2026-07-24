import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full min-h-screen max-w-3xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <Link href="/" className="text-lg font-bold">
          Esport Management Software
        </Link>
        <nav className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
          <Link href="/legal/mentions-legales" className="hover:underline">
            Mentions légales
          </Link>
          <Link href="/legal/confidentialite" className="hover:underline">
            Confidentialité
          </Link>
        </nav>
      </header>
      <main className="prose-sm max-w-none">{children}</main>
    </div>
  );
}
