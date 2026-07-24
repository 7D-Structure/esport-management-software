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
  const { organization } = await requireAdmin();

  const data = readDocumentForm(formData);
  const doc = await prisma.document.create({
    data: { ...data, organizationId: organization.id },
  });

  revalidatePath("/admin/documents");
  revalidatePath("/space/documents");
  redirect(`/admin/documents/${doc.id}`);
}

export async function updateDocument(documentId: string, formData: FormData) {
  const { organization } = await requireAdmin();

  const data = readDocumentForm(formData);
  await prisma.document.updateMany({
    where: { id: documentId, organizationId: organization.id },
    data,
  });

  revalidatePath("/admin/documents");
  revalidatePath(`/admin/documents/${documentId}`);
  revalidatePath("/space/documents");
}

export async function deleteDocument(formData: FormData) {
  const { organization } = await requireAdmin();

  const id = String(formData.get("id"));
  await prisma.document.deleteMany({
    where: { id, organizationId: organization.id },
  });

  revalidatePath("/admin/documents");
  revalidatePath("/space/documents");
  redirect("/admin/documents");
}
