"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { configFileSchema } from "@/lib/validation";

export async function createConfig(formData: FormData) {
  const session = await requireUser();

  const data = configFileSchema.parse({
    name: formData.get("name"),
    game: formData.get("game"),
    content: formData.get("content"),
  });

  const config = await prisma.configFile.create({
    data: { ...data, userId: session.user.id },
  });

  revalidatePath("/space/configs");
  redirect(`/space/configs/${config.id}`);
}

export async function updateConfig(configId: string, formData: FormData) {
  const session = await requireUser();

  const data = configFileSchema.parse({
    name: formData.get("name"),
    game: formData.get("game"),
    content: formData.get("content"),
  });

  // Scope by userId so a user can only edit their own configs.
  await prisma.configFile.updateMany({
    where: { id: configId, userId: session.user.id },
    data,
  });

  revalidatePath("/space/configs");
  revalidatePath(`/space/configs/${configId}`);
}

export async function deleteConfig(formData: FormData) {
  const session = await requireUser();

  const id = String(formData.get("id"));
  await prisma.configFile.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/space/configs");
  redirect("/space/configs");
}
