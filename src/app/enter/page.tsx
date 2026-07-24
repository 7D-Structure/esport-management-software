import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Post-login landing that routes users based on their organization membership.
export default async function EnterPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const membershipCount = await prisma.organizationMembership.count({
    where: { userId: session.user.id },
  });

  // Members of an organization go to its admin area; everyone else to /space.
  if (membershipCount > 0) {
    redirect("/admin/players");
  }

  redirect("/space");
}
