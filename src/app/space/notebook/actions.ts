"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { noteSchema } from "@/lib/validation";

export async function createNote(formData: FormData) {
  const session = await requireUser();

  const data = noteSchema.parse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  const note = await prisma.note.create({
    data: { ...data, userId: session.user.id },
  });

  revalidatePath("/space/notebook");
  redirect(`/space/notebook/${note.id}`);
}

export async function updateNote(noteId: string, formData: FormData) {
  const session = await requireUser();

  const data = noteSchema.parse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  await prisma.note.updateMany({
    where: { id: noteId, userId: session.user.id },
    data,
  });

  revalidatePath("/space/notebook");
  revalidatePath(`/space/notebook/${noteId}`);
}

export async function deleteNote(formData: FormData) {
  const session = await requireUser();

  const id = String(formData.get("id"));
  await prisma.note.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/space/notebook");
  redirect("/space/notebook");
}
