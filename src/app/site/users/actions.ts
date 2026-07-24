"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireSiteAdmin } from "@/lib/require-admin";
import { userCreateSchema, userUpdateSchema } from "@/lib/validation";

export async function createUser(formData: FormData) {
  await requireSiteAdmin();

  const data = userCreateSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
  });

  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    redirect(
      `/site/users/new?error=${encodeURIComponent("Cet email est déjà utilisé.")}`,
    );
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      passwordHash,
    },
  });

  revalidatePath("/site/users");
  redirect("/site/users");
}

export async function updateUser(userId: string, formData: FormData) {
  const session = await requireSiteAdmin();

  const data = userUpdateSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
  });

  // Prevent an admin from demoting themselves and losing access.
  if (userId === session.user.id && data.role !== "ADMIN") {
    redirect(
      `/site/users/${userId}?error=${encodeURIComponent("Vous ne pouvez pas changer votre propre rôle.")}`,
    );
  }

  // Guard email uniqueness against other users.
  const emailOwner = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (emailOwner && emailOwner.id !== userId) {
    redirect(
      `/site/users/${userId}?error=${encodeURIComponent("Cet email est déjà utilisé.")}`,
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      ...(data.password
        ? { passwordHash: await bcrypt.hash(data.password, 10) }
        : {}),
    },
  });

  revalidatePath("/site/users");
  revalidatePath(`/site/users/${userId}`);
  redirect("/site/users");
}

export async function deleteUser(formData: FormData) {
  const session = await requireSiteAdmin();

  const id = String(formData.get("id"));

  // Never let an admin delete their own account.
  if (id === session.user.id) {
    redirect(
      `/site/users?error=${encodeURIComponent("Vous ne pouvez pas supprimer votre propre compte.")}`,
    );
  }

  await prisma.user.delete({ where: { id } });

  revalidatePath("/site/users");
  redirect("/site/users");
}
