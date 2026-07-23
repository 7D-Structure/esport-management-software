"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { signOut } from "@/auth";

// GDPR right to erasure: delete the account and its personal data.
// Cascades remove personal records (configs, goals, notes, LFT profile,
// rosters owned, memberships, invitations); links from org-owned Player/Staff
// records are set to null so those organizations keep their own management data.
export async function deleteAccount(formData: FormData) {
  const session = await requireUser();
  const userId = session.user.id;

  const confirm = String(formData.get("confirm") ?? "").trim();
  if (confirm !== "SUPPRIMER") {
    redirect(
      `/space/account?error=${encodeURIComponent('Tapez "SUPPRIMER" pour confirmer.')}`,
    );
  }

  // Organizations this user owns.
  const ownerMemberships = await prisma.organizationMembership.findMany({
    where: { userId, role: "OWNER" },
    select: { organizationId: true, organization: { select: { name: true } } },
  });

  const soloOrgIds: string[] = [];
  const sharedOrgNames: string[] = [];

  for (const m of ownerMemberships) {
    const otherMembers = await prisma.organizationMembership.count({
      where: { organizationId: m.organizationId, userId: { not: userId } },
    });
    if (otherMembers > 0) {
      sharedOrgNames.push(m.organization.name);
    } else {
      soloOrgIds.push(m.organizationId);
    }
  }

  // Block deletion if the user owns an organization shared with other members,
  // to avoid erasing other people's data. They must transfer/remove it first.
  if (sharedOrgNames.length > 0) {
    const list = sharedOrgNames.join(", ");
    redirect(
      `/space/account?error=${encodeURIComponent(
        `Vous êtes propriétaire d'organisation(s) partagée(s) avec d'autres membres (${list}). Transférez ou faites supprimer ces organisations avant de supprimer votre compte.`,
      )}`,
    );
  }

  // Delete organizations the user solely owns (removes their org data), then
  // the user account itself.
  if (soloOrgIds.length > 0) {
    await prisma.organization.deleteMany({ where: { id: { in: soloOrgIds } } });
  }
  await prisma.user.delete({ where: { id: userId } });

  await signOut({ redirectTo: "/" });
}
