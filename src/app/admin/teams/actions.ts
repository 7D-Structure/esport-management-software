"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { teamSchema } from "@/lib/validation";

export async function createTeam(formData: FormData) {
  const { organization } = await requireAdmin();

  const parsed = teamSchema.parse({
    name: formData.get("name"),
    game: formData.get("game"),
  });

  await prisma.team.create({
    data: { ...parsed, organizationId: organization.id },
  });

  revalidatePath("/admin/teams");
  redirect("/admin/teams");
}

export async function deleteTeam(formData: FormData) {
  const { organization } = await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.team.deleteMany({
    where: { id, organizationId: organization.id },
  });

  revalidatePath("/admin/teams");
}
