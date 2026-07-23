"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { canManageOrg } from "@/lib/org";

function str(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function updateIntegrations(formData: FormData) {
  const { organization, membership } = await requireAdmin();
  if (!canManageOrg(membership.role)) {
    redirect("/admin/players");
  }

  const faceitApiKey = str(formData.get("faceitApiKey"));
  const helloAssoClientId = str(formData.get("helloAssoClientId"));
  const helloAssoClientSecret = str(formData.get("helloAssoClientSecret"));
  const helloAssoOrgSlug = str(formData.get("helloAssoOrgSlug"));

  await prisma.organization.update({
    where: { id: organization.id },
    data: {
      // Non-secret fields: save as-is (blank clears them).
      helloAssoClientId: helloAssoClientId || null,
      helloAssoOrgSlug: helloAssoOrgSlug || null,
      // Secret fields: only overwrite when a new value is provided.
      ...(faceitApiKey ? { faceitApiKey } : {}),
      ...(helloAssoClientSecret ? { helloAssoClientSecret } : {}),
    },
  });

  revalidatePath("/admin/integrations");
  redirect("/admin/integrations?saved=1");
}
