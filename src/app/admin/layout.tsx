import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";

const NAV_LINKS = [
  { href: "/admin/players", label: "Joueurs" },
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/teams", label: "Équipes" },
  { href: "/admin/agenda", label: "Agenda" },
  { href: "/admin/costs", label: "Coûts" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="mx-auto flex w-full min-h-screen max-w-6xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <nav className="flex items-center gap-6">
          <span className="text-lg font-bold">Administration</span>
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
