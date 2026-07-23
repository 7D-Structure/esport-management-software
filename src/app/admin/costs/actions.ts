"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { financeEntrySchema } from "@/lib/validation";
import { eurosToCents } from "@/lib/money";

function readFinanceForm(formData: FormData) {
  const parsed = financeEntrySchema.parse({
    label: formData.get("label"),
    type: formData.get("type"),
    category: formData.get("category"),
    amount: formData.get("amount"),
    date: formData.get("date"),
    notes: formData.get("notes"),
    teamId: formData.get("teamId"),
  });

  const { amount, ...rest } = parsed;
  return { ...rest, amountCents: eurosToCents(amount) };
}

export async function createFinanceEntry(formData: FormData) {
  await requireAdmin();

  const data = readFinanceForm(formData);
  const entry = await prisma.financeEntry.create({ data });

  revalidatePath("/admin/costs");
  redirect(`/admin/costs/${entry.id}`);
}

export async function updateFinanceEntry(entryId: string, formData: FormData) {
  await requireAdmin();

  const data = readFinanceForm(formData);
  await prisma.financeEntry.update({ where: { id: entryId }, data });

  revalidatePath("/admin/costs");
  revalidatePath(`/admin/costs/${entryId}`);
}

export async function deleteFinanceEntry(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.financeEntry.delete({ where: { id } });

  revalidatePath("/admin/costs");
  redirect("/admin/costs");
}
