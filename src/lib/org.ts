import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const ACTIVE_ORG_COOKIE = "activeOrgId";

// Org roles that can access the organization admin area (all of them, today).
const ORG_ADMIN_ROLES = new Set(["OWNER", "ADMIN", "MANAGER", "COACH", "STAFF"]);

export type OrgContext = Awaited<ReturnType<typeof getOrgContext>>;

// Resolve the current user, their memberships, and the active organization
// (from the activeOrgId cookie, falling back to their first membership).
export async function getOrgContext() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const memberships = await prisma.organizationMembership.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  if (memberships.length === 0) {
    return { session, memberships, membership: null, organization: null };
  }

  const cookieStore = await cookies();
  const activeId = cookieStore.get(ACTIVE_ORG_COOKIE)?.value;
  const active =
    memberships.find((m) => m.organizationId === activeId) ?? memberships[0];

  return {
    session,
    memberships,
    membership: active,
    organization: active.organization,
  };
}

// Require an authenticated user who belongs to at least one organization.
// Returns the active organization context.
export async function requireOrgAdmin() {
  const ctx = await getOrgContext();
  if (!ctx) {
    redirect("/login");
  }
  if (!ctx.membership || !ctx.organization) {
    redirect("/onboarding/organization");
  }
  if (!ORG_ADMIN_ROLES.has(ctx.membership.role)) {
    redirect("/space");
  }

  return {
    session: ctx.session,
    memberships: ctx.memberships,
    membership: ctx.membership,
    organization: ctx.organization,
  };
}

// Roles allowed to manage the organization itself (members, settings).
export function canManageOrg(role: string): boolean {
  return role === "OWNER" || role === "ADMIN";
}
