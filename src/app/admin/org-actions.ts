"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { ACTIVE_ORG_COOKIE } from "@/lib/org";

// Switch the active organization (only to one the user belongs to).
export async function switchOrganization(formData: FormData) {
  const session = await requireUser();
  const orgId = String(formData.get("orgId"));

  const membership = await prisma.organizationMembership.findUnique({
    where: {
      organizationId_userId: { organizationId: orgId, userId: session.user.id },
    },
  });
  if (!membership) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_ORG_COOKIE, orgId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect("/admin/players");
}
