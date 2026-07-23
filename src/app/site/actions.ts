"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSiteAdmin } from "@/lib/require-admin";
import { uniqueOrgSlug } from "@/lib/slug";

// Site admin creates an organization and assigns an existing account as OWNER.
export async function createOrganizationForOwner(formData: FormData) {
  await requireSiteAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const ownerEmail = String(formData.get("ownerEmail") ?? "").trim();

  if (!name) {
    redirect(`/site?error=${encodeURIComponent("Le nom est requis.")}`);
  }

  const owner = await prisma.user.findUnique({ where: { email: ownerEmail } });
  if (!owner) {
    redirect(
      `/site?error=${encodeURIComponent("Aucun compte avec cet email pour le propriétaire.")}`,
    );
  }

  const slug = await uniqueOrgSlug(name);
  await prisma.organization.create({
    data: {
      name,
      slug,
      memberships: { create: [{ userId: owner.id, role: "OWNER" }] },
    },
  });

  revalidatePath("/site");
  redirect("/site");
}

export async function deleteOrganization(formData: FormData) {
  await requireSiteAdmin();

  const id = String(formData.get("id"));
  await prisma.organization.delete({ where: { id } });

  revalidatePath("/site");
  redirect("/site");
}

export async function toggleSiteAdmin(formData: FormData) {
  const session = await requireSiteAdmin();

  const userId = String(formData.get("userId"));
  const makeAdmin = formData.get("makeAdmin") === "true";

  // An admin cannot revoke their own site-admin access (avoid lockout).
  if (userId === session.user.id && !makeAdmin) {
    redirect(
      `/site/users?error=${encodeURIComponent("Vous ne pouvez pas retirer votre propre accès super-admin.")}`,
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isSiteAdmin: makeAdmin },
  });

  revalidatePath("/site/users");
}
