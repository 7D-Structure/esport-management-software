"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { getHelloAssoMembers } from "@/lib/helloasso";

// Map a HelloAsso membership state to a local license status.
function licenseStatusFor(state?: string): "ACTIVE" | "PENDING" {
  return state === "Processed" || state === "Registered" ? "ACTIVE" : "PENDING";
}

export async function syncHelloAssoMembers() {
  const { organization } = await requireAdmin();

  const result = await getHelloAssoMembers();

  if (!result.ok) {
    const params = new URLSearchParams({ error: result.message });
    redirect(`/admin/helloasso?${params.toString()}`);
  }

  let created = 0;
  let updated = 0;

  for (const member of result.members) {
    const existing = await prisma.player.findFirst({
      where: {
        helloAssoMemberId: member.memberId,
        organizationId: organization.id,
      },
    });

    const licenseStatus = licenseStatusFor(member.state);

    if (existing) {
      await prisma.player.update({
        where: { id: existing.id },
        data: {
          firstName: member.firstName || existing.firstName,
          lastName: member.lastName || existing.lastName,
          licenseStatus,
        },
      });
      updated += 1;
    } else {
      const fallbackTag =
        `${member.firstName} ${member.lastName}`.trim() || "Membre HelloAsso";
      await prisma.player.create({
        data: {
          organizationId: organization.id,
          firstName: member.firstName || "—",
          lastName: member.lastName || "—",
          gamertag: fallbackTag,
          game: "OTHER",
          licenseStatus,
          helloAssoMemberId: member.memberId,
          contacts: member.email
            ? { create: [{ type: "EMAIL", value: member.email }] }
            : undefined,
        },
      });
      created += 1;
    }
  }

  revalidatePath("/admin/players");
  revalidatePath("/admin/helloasso");

  const params = new URLSearchParams({
    created: String(created),
    updated: String(updated),
  });
  redirect(`/admin/helloasso?${params.toString()}`);
}
