"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { ACTIVE_ORG_COOKIE } from "@/lib/org";
import { organizationSchema } from "@/lib/validation";

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

async function uniqueSlug(base: string): Promise<string> {
  const root = base || "organisation";
  let candidate = root;
  let attempt = 0;
  // Append a short random suffix until the slug is free.
  while (await prisma.organization.findUnique({ where: { slug: candidate } })) {
    attempt += 1;
    candidate = `${root}-${Math.random().toString(36).slice(2, 6)}`;
    if (attempt > 5) {
      candidate = `${root}-${Date.now().toString(36)}`;
      break;
    }
  }
  return candidate;
}

export async function createOrganization(formData: FormData) {
  const session = await requireUser();

  const { name } = organizationSchema.parse({ name: formData.get("name") });
  const slug = await uniqueSlug(slugify(name));

  const organization = await prisma.organization.create({
    data: {
      name,
      slug,
      memberships: {
        create: [{ userId: session.user.id, role: "OWNER" }],
      },
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_ORG_COOKIE, organization.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect("/admin/players");
}
