"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  availabilitySchema,
  contactSchema,
  staffSchema,
} from "@/lib/validation";

function readStaffForm(formData: FormData) {
  return staffSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    role: formData.get("role"),
    teamId: formData.get("teamId"),
  });
}

export async function createStaff(formData: FormData) {
  await requireAdmin();

  const data = readStaffForm(formData);
  const staff = await prisma.staff.create({ data });

  revalidatePath("/admin/staff");
  redirect(`/admin/staff/${staff.id}`);
}

export async function updateStaff(staffId: string, formData: FormData) {
  await requireAdmin();

  const data = readStaffForm(formData);
  await prisma.staff.update({ where: { id: staffId }, data });

  revalidatePath("/admin/staff");
  revalidatePath(`/admin/staff/${staffId}`);
}

export async function deleteStaff(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.staff.delete({ where: { id } });

  revalidatePath("/admin/staff");
  redirect("/admin/staff");
}

export async function addStaffContact(staffId: string, formData: FormData) {
  await requireAdmin();

  const data = contactSchema.parse({
    type: formData.get("type"),
    value: formData.get("value"),
    label: formData.get("label"),
  });

  await prisma.contact.create({ data: { ...data, staffId } });
  revalidatePath(`/admin/staff/${staffId}`);
}

export async function deleteStaffContact(staffId: string, formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.contact.delete({ where: { id } });
  revalidatePath(`/admin/staff/${staffId}`);
}

export async function addStaffAvailability(
  staffId: string,
  formData: FormData,
) {
  await requireAdmin();

  const data = availabilitySchema.parse({
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    note: formData.get("note"),
  });

  await prisma.availability.create({ data: { ...data, staffId } });
  revalidatePath(`/admin/staff/${staffId}`);
}

export async function deleteStaffAvailability(
  staffId: string,
  formData: FormData,
) {
  await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.availability.delete({ where: { id } });
  revalidatePath(`/admin/staff/${staffId}`);
}
