"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { canManageOrg } from "@/lib/org";
import { orgMemberSchema } from "@/lib/validation";

async function requireOrgManager() {
  const ctx = await requireAdmin();
  if (!canManageOrg(ctx.membership.role)) {
    redirect("/admin/players");
  }
  return ctx;
}

export async function addMember(formData: FormData) {
  const { organization } = await requireOrgManager();

  const { email, role } = orgMemberSchema.parse({
    email: formData.get("email"),
    role: formData.get("role"),
  });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    redirect(
      `/admin/members?error=${encodeURIComponent("Aucun compte avec cet email. La personne doit d'abord créer un compte.")}`,
    );
  }

  await prisma.organizationMembership.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: user.id,
      },
    },
    update: { role },
    create: { organizationId: organization.id, userId: user.id, role },
  });

  revalidatePath("/admin/members");
  redirect("/admin/members");
}

export async function changeMemberRole(formData: FormData) {
  const { organization } = await requireOrgManager();

  const membershipId = String(formData.get("membershipId"));
  const role = String(formData.get("role"));
  if (!["ADMIN", "MANAGER", "COACH", "STAFF"].includes(role)) {
    return;
  }

  // Never change the OWNER's role via this action.
  await prisma.organizationMembership.updateMany({
    where: {
      id: membershipId,
      organizationId: organization.id,
      role: { not: "OWNER" },
    },
    data: { role: role as "ADMIN" | "MANAGER" | "COACH" | "STAFF" },
  });

  revalidatePath("/admin/members");
}

export async function removeMember(formData: FormData) {
  const { organization } = await requireOrgManager();

  const membershipId = String(formData.get("membershipId"));

  // Never remove the OWNER.
  await prisma.organizationMembership.deleteMany({
    where: {
      id: membershipId,
      organizationId: organization.id,
      role: { not: "OWNER" },
    },
  });

  revalidatePath("/admin/members");
}
