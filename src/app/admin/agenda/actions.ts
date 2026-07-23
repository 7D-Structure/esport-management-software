"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { eventSchema } from "@/lib/validation";

function readEventForm(formData: FormData) {
  return eventSchema.parse({
    title: formData.get("title"),
    type: formData.get("type"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    opponent: formData.get("opponent"),
    location: formData.get("location"),
    notes: formData.get("notes"),
    status: formData.get("status"),
    teamId: formData.get("teamId"),
  });
}

export async function createEvent(formData: FormData) {
  const { organization } = await requireAdmin();

  const data = readEventForm(formData);
  const event = await prisma.event.create({
    data: { ...data, organizationId: organization.id },
  });

  revalidatePath("/admin/agenda");
  redirect(`/admin/agenda/${event.id}`);
}

export async function updateEvent(eventId: string, formData: FormData) {
  const { organization } = await requireAdmin();

  const data = readEventForm(formData);
  await prisma.event.updateMany({
    where: { id: eventId, organizationId: organization.id },
    data,
  });

  revalidatePath("/admin/agenda");
  revalidatePath(`/admin/agenda/${eventId}`);
}

export async function deleteEvent(formData: FormData) {
  const { organization } = await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.event.deleteMany({
    where: { id, organizationId: organization.id },
  });

  revalidatePath("/admin/agenda");
  redirect("/admin/agenda");
}
