import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GDPR data portability: export all personal data tied to the current account
// as a downloadable JSON file.
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isSiteAdmin: true,
      createdAt: true,
      updatedAt: true,
      configFiles: true,
      goals: true,
      notes: true,
      playerProfile: true,
      orgMemberships: {
        select: {
          role: true,
          createdAt: true,
          organization: { select: { name: true, slug: true } },
        },
      },
      rostersOwned: { include: { memberships: true, invitations: true } },
      rosterMemberships: {
        select: {
          role: true,
          joinedAt: true,
          roster: { select: { name: true } },
        },
      },
      invitationsReceived: {
        select: {
          status: true,
          message: true,
          createdAt: true,
          roster: { select: { name: true } },
        },
      },
      invitationsSent: {
        select: { status: true, message: true, createdAt: true },
      },
      // Management records held about this user by organizations they belong to.
      player: { include: { contacts: true, availabilities: true } },
      staff: { include: { contacts: true, availabilities: true } },
    },
  });

  if (!user) {
    return new NextResponse("Not found", { status: 404 });
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    account: user,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="mes-donnees.json"`,
    },
  });
}
