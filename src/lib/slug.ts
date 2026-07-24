import { prisma } from "@/lib/prisma";

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

// Produce an organization slug not already taken.
export async function uniqueOrgSlug(base: string): Promise<string> {
  const root = slugify(base) || "organisation";
  let candidate = root;
  let attempt = 0;
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
