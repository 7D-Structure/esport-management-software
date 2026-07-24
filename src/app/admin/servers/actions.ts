"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { gameServerSchema } from "@/lib/validation";
import { encryptSecret } from "@/lib/crypto";

// Read the form, splitting out the secret password fields. Passwords use a
// "blank = keep existing" convention and are encrypted at rest.
function readServerForm(formData: FormData) {
  const parsed = gameServerSchema.parse({
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

  const { serverPassword, rconPassword, ...rest } = parsed;
  const secrets = {
    ...(serverPassword
      ? { serverPassword: encryptSecret(serverPassword) }
      : {}),
    ...(rconPassword ? { rconPassword: encryptSecret(rconPassword) } : {}),
  };
  return { rest, secrets };
}

export async function createServer(formData: FormData) {
  const { organization } = await requireAdmin();

  const { rest, secrets } = readServerForm(formData);
  const server = await prisma.gameServer.create({
    data: { ...rest, ...secrets, organizationId: organization.id },
  });

  revalidatePath("/admin/servers");
  redirect(`/admin/servers/${server.id}`);
}

export async function updateServer(serverId: string, formData: FormData) {
  const { organization } = await requireAdmin();

  const { rest, secrets } = readServerForm(formData);
  // Secrets omitted when left blank, so existing values are preserved.
  await prisma.gameServer.updateMany({
    where: { id: serverId, organizationId: organization.id },
    data: { ...rest, ...secrets },
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
