import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import { canManageOrg } from "@/lib/org";
import { signOut } from "@/auth";
import { OrgSwitcher } from "./org-switcher";

const NAV_LINKS = [
  { href: "/admin/players", label: "Joueurs" },
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/teams", label: "Équipes" },
  { href: "/admin/agenda", label: "Agenda" },
  { href: "/admin/costs", label: "Coûts" },
  { href: "/admin/servers", label: "Serveurs" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/helloasso", label: "HelloAsso" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, organization, membership, memberships } =
    await requireAdmin();

  const navLinks = canManageOrg(membership.role)
    ? [
        ...NAV_LINKS,
        { href: "/admin/members", label: "Membres" },
        { href: "/admin/integrations", label: "Intégrations" },
      ]
    : NAV_LINKS;

  return (
    <div className="mx-auto flex w-full min-h-screen max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-lg font-bold">Administration</span>
          {navLinks.map((link) => (
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
          <OrgSwitcher
            memberships={memberships.map((m) => ({
              id: m.organizationId,
              name: m.organization.name,
            }))}
            activeId={organization.id}
          />
          {session.user.isSiteAdmin && (
            <Link href="/site" className="hover:underline">
              Site
            </Link>
          )}
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
