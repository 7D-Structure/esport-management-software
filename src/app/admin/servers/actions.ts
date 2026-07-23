"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { gameServerSchema } from "@/lib/validation";

function readServerForm(formData: FormData) {
  return gameServerSchema.parse({
    name: formData.get("name"),
    game: formData.get("game"),
    status: formData.get("status"),
    host: formData.get("host"),
    port: formData.get("port"),
    serverPassword: formData.get("serverPassword"),
    rconPassword: formData.get("rconPassword"),
    provider: formData.get("provider"),
    location: formData.get("location"),
    notes: formData.get("notes"),
    teamId: formData.get("teamId"),
  });
}

export async function createServer(formData: FormData) {
  const { organization } = await requireAdmin();

  const data = readServerForm(formData);
  const server = await prisma.gameServer.create({
    data: { ...data, organizationId: organization.id },
  });

  revalidatePath("/admin/servers");
  redirect(`/admin/servers/${server.id}`);
}

export async function updateServer(serverId: string, formData: FormData) {
  const { organization } = await requireAdmin();

  const data = readServerForm(formData);
  await prisma.gameServer.updateMany({
    where: { id: serverId, organizationId: organization.id },
    data,
  });

  revalidatePath("/admin/servers");
  revalidatePath(`/admin/servers/${serverId}`);
}

export async function deleteServer(formData: FormData) {
  const { organization } = await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.gameServer.deleteMany({
    where: { id, organizationId: organization.id },
  });

  revalidatePath("/admin/servers");
  redirect("/admin/servers");
}
