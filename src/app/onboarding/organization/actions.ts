"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { ACTIVE_ORG_COOKIE } from "@/lib/org";
import { uniqueOrgSlug } from "@/lib/slug";
import { organizationSchema } from "@/lib/validation";

export async function createOrganization(formData: FormData) {
  const session = await requireUser();

  const { name } = organizationSchema.parse({ name: formData.get("name") });
  const slug = await uniqueOrgSlug(name);

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
