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

// Confirm a player belongs to the active organization before mutating children.
async function playerInOrg(playerId: string, organizationId: string) {
  return prisma.player.findFirst({
    where: { id: playerId, organizationId },
    select: { id: true },
  });
}

export async function createPlayer(formData: FormData) {
  const { organization } = await requireAdmin();

  const data = readPlayerForm(formData);
  const player = await prisma.player.create({
    data: { ...data, organizationId: organization.id },
  });

  revalidatePath("/admin/players");
  redirect(`/admin/players/${player.id}`);
}

export async function updatePlayer(playerId: string, formData: FormData) {
  const { organization } = await requireAdmin();

  const data = readPlayerForm(formData);
  await prisma.player.updateMany({
    where: { id: playerId, organizationId: organization.id },
    data,
  });

  revalidatePath("/admin/players");
  revalidatePath(`/admin/players/${playerId}`);
}

export async function deletePlayer(formData: FormData) {
  const { organization } = await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.player.deleteMany({
    where: { id, organizationId: organization.id },
  });

  revalidatePath("/admin/players");
  redirect("/admin/players");
}

export async function addPlayerContact(playerId: string, formData: FormData) {
  const { organization } = await requireAdmin();
  if (!(await playerInOrg(playerId, organization.id))) return;

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
  const { organization } = await requireAdmin();
  if (!(await playerInOrg(playerId, organization.id))) return;

  const id = String(formData.get("id"));
  await prisma.contact.deleteMany({ where: { id, playerId } });
  revalidatePath(`/admin/players/${playerId}`);
}

export async function addPlayerAvailability(
  playerId: string,
  formData: FormData,
) {
  const { organization } = await requireAdmin();
  if (!(await playerInOrg(playerId, organization.id))) return;

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
  const { organization } = await requireAdmin();
  if (!(await playerInOrg(playerId, organization.id))) return;

  const id = String(formData.get("id"));
  await prisma.availability.deleteMany({ where: { id, playerId } });
  revalidatePath(`/admin/players/${playerId}`);
}
