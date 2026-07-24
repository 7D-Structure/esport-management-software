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

async function staffInOrg(staffId: string, organizationId: string) {
  return prisma.staff.findFirst({
    where: { id: staffId, organizationId },
    select: { id: true },
  });
}

export async function createStaff(formData: FormData) {
  const { organization } = await requireAdmin();

  const data = readStaffForm(formData);
  const staff = await prisma.staff.create({
    data: { ...data, organizationId: organization.id },
  });

  revalidatePath("/admin/staff");
  redirect(`/admin/staff/${staff.id}`);
}

export async function updateStaff(staffId: string, formData: FormData) {
  const { organization } = await requireAdmin();

  const data = readStaffForm(formData);
  await prisma.staff.updateMany({
    where: { id: staffId, organizationId: organization.id },
    data,
  });

  revalidatePath("/admin/staff");
  revalidatePath(`/admin/staff/${staffId}`);
}

export async function deleteStaff(formData: FormData) {
  const { organization } = await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.staff.deleteMany({
    where: { id, organizationId: organization.id },
  });

  revalidatePath("/admin/staff");
  redirect("/admin/staff");
}

export async function addStaffContact(staffId: string, formData: FormData) {
  const { organization } = await requireAdmin();
  if (!(await staffInOrg(staffId, organization.id))) return;

  const data = contactSchema.parse({
    type: formData.get("type"),
    value: formData.get("value"),
    label: formData.get("label"),
  });

  await prisma.contact.create({ data: { ...data, staffId } });
  revalidatePath(`/admin/staff/${staffId}`);
}

export async function deleteStaffContact(staffId: string, formData: FormData) {
  const { organization } = await requireAdmin();
  if (!(await staffInOrg(staffId, organization.id))) return;

  const id = String(formData.get("id"));
  await prisma.contact.deleteMany({ where: { id, staffId } });
  revalidatePath(`/admin/staff/${staffId}`);
}

export async function addStaffAvailability(
  staffId: string,
  formData: FormData,
) {
  const { organization } = await requireAdmin();
  if (!(await staffInOrg(staffId, organization.id))) return;

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
  const { organization } = await requireAdmin();
  if (!(await staffInOrg(staffId, organization.id))) return;

  const id = String(formData.get("id"));
  await prisma.availability.deleteMany({ where: { id, staffId } });
  revalidatePath(`/admin/staff/${staffId}`);
}
