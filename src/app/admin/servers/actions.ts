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
  await requireAdmin();

  const data = readServerForm(formData);
  const server = await prisma.gameServer.create({ data });

  revalidatePath("/admin/servers");
  redirect(`/admin/servers/${server.id}`);
}

export async function updateServer(serverId: string, formData: FormData) {
  await requireAdmin();

  const data = readServerForm(formData);
  await prisma.gameServer.update({ where: { id: serverId }, data });

  revalidatePath("/admin/servers");
  revalidatePath(`/admin/servers/${serverId}`);
}

export async function deleteServer(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.gameServer.delete({ where: { id } });

  revalidatePath("/admin/servers");
  redirect("/admin/servers");
}
