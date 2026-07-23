"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  availabilitySchema,
  contactSchema,
  playerSchema,
} from "@/lib/validation";

function readPlayerForm(formData: FormData) {
  return playerSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    gamertag: formData.get("gamertag"),
    game: formData.get("game"),
    inGameRole: formData.get("inGameRole"),
    faceitNickname: formData.get("faceitNickname"),
    dateOfBirth: formData.get("dateOfBirth"),
    licenseNumber: formData.get("licenseNumber"),
    licenseStatus: formData.get("licenseStatus"),
    licenseExpiresAt: formData.get("licenseExpiresAt"),
    teamId: formData.get("teamId"),
  });
}

export async function createPlayer(formData: FormData) {
  await requireAdmin();

  const data = readPlayerForm(formData);
  const player = await prisma.player.create({ data });

  revalidatePath("/admin/players");
  redirect(`/admin/players/${player.id}`);
}

export async function updatePlayer(playerId: string, formData: FormData) {
  await requireAdmin();

  const data = readPlayerForm(formData);
  await prisma.player.update({ where: { id: playerId }, data });

  revalidatePath("/admin/players");
  revalidatePath(`/admin/players/${playerId}`);
}

export async function deletePlayer(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.player.delete({ where: { id } });

  revalidatePath("/admin/players");
  redirect("/admin/players");
}

export async function addPlayerContact(playerId: string, formData: FormData) {
  await requireAdmin();

  const data = contactSchema.parse({
    type: formData.get("type"),
    value: formData.get("value"),
    label: formData.get("label"),
  });

  await prisma.contact.create({ data: { ...data, playerId } });
  revalidatePath(`/admin/players/${playerId}`);
}

export async function deletePlayerContact(
  playerId: string,
  formData: FormData,
) {
  await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.contact.delete({ where: { id } });
  revalidatePath(`/admin/players/${playerId}`);
}

export async function addPlayerAvailability(
  playerId: string,
  formData: FormData,
) {
  await requireAdmin();

  const data = availabilitySchema.parse({
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    note: formData.get("note"),
  });

  await prisma.availability.create({ data: { ...data, playerId } });
  revalidatePath(`/admin/players/${playerId}`);
}

export async function deletePlayerAvailability(
  playerId: string,
  formData: FormData,
) {
  await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.availability.delete({ where: { id } });
  revalidatePath(`/admin/players/${playerId}`);
}
