"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { documentSchema } from "@/lib/validation";

function readDocumentForm(formData: FormData) {
  return documentSchema.parse({
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    url: formData.get("url"),
  });
}

export async function createDocument(formData: FormData) {
  await requireAdmin();

  const data = readDocumentForm(formData);
  const doc = await prisma.document.create({ data });

  revalidatePath("/admin/documents");
  revalidatePath("/space/documents");
  redirect(`/admin/documents/${doc.id}`);
}

export async function updateDocument(documentId: string, formData: FormData) {
  await requireAdmin();

  const data = readDocumentForm(formData);
  await prisma.document.update({ where: { id: documentId }, data });

  revalidatePath("/admin/documents");
  revalidatePath(`/admin/documents/${documentId}`);
  revalidatePath("/space/documents");
}

export async function deleteDocument(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.document.delete({ where: { id } });

  revalidatePath("/admin/documents");
  revalidatePath("/space/documents");
  redirect("/admin/documents");
}
