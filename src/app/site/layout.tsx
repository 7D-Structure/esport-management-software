import Link from "next/link";
import { requireSiteAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";

const NAV_LINKS = [
  { href: "/site", label: "Organisations" },
  { href: "/site/users", label: "Comptes" },
];

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSiteAdmin();

  return (
    <div className="mx-auto flex w-full min-h-screen max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-lg font-bold">Administration du site</span>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <Link href="/admin/players" className="hover:underline">
            Mon organisation
          </Link>
          <span>{session.user.name}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button type="submit" className="hover:underline">
              Déconnexion
            </button>
          </form>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
