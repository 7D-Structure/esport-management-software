import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { requireOrgAdmin } from "@/lib/org";

// Organization admin area: requires membership in the active organization.
// Returns the active org context (session, organization, membership, memberships).
export async function requireAdmin() {
  return requireOrgAdmin();
}

// Stricter guard for site-wide management: site admins only.
export async function requireSiteAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  if (!session.user.isSiteAdmin) {
    redirect("/admin/players");
  }

  return session;
}
