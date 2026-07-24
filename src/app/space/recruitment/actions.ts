"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import {
  invitationSchema,
  playerProfileSchema,
  rosterSchema,
} from "@/lib/validation";

// --- Player profile (LFT) ---

export async function saveProfile(formData: FormData) {
  const session = await requireUser();
  const userId = session.user.id;

  const data = playerProfileSchema.parse({
    game: formData.get("game"),
    inGameRole: formData.get("inGameRole"),
    faceitNickname: formData.get("faceitNickname"),
    availability: formData.get("availability"),
    bio: formData.get("bio"),
    lookingForTeam: formData.get("lookingForTeam"),
  });

  await prisma.playerProfile.upsert({
    where: { userId },
    update: data,
    create: { ...data, userId },
  });

  revalidatePath("/space/recruitment");
  revalidatePath("/space/recruitment/profile");
  revalidatePath("/space/recruitment/players");
  redirect("/space/recruitment");
}

// --- Rosters (teams) ---

function readRosterForm(formData: FormData) {
  return rosterSchema.parse({
    name: formData.get("name"),
    game: formData.get("game"),
    description: formData.get("description"),
    roleNeeded: formData.get("roleNeeded"),
    minFaceitLevel: formData.get("minFaceitLevel"),
    recruiting: formData.get("recruiting"),
  });
}

export async function createRoster(formData: FormData) {
  const session = await requireUser();

  const data = readRosterForm(formData);
  const roster = await prisma.roster.create({
    data: { ...data, ownerId: session.user.id },
  });

  // The owner is automatically the first member of the roster.
  await prisma.rosterMembership.create({
    data: { rosterId: roster.id, userId: session.user.id, role: "Capitaine" },
  });

  revalidatePath("/space/recruitment");
  revalidatePath("/space/recruitment/teams");
  redirect(`/space/recruitment/rosters/${roster.id}`);
}

export async function updateRoster(rosterId: string, formData: FormData) {
  const session = await requireUser();

  const data = readRosterForm(formData);
  await prisma.roster.updateMany({
    where: { id: rosterId, ownerId: session.user.id },
    data,
  });

  revalidatePath("/space/recruitment/teams");
  revalidatePath(`/space/recruitment/rosters/${rosterId}`);
}

export async function deleteRoster(formData: FormData) {
  const session = await requireUser();

  const id = String(formData.get("id"));
  await prisma.roster.deleteMany({
    where: { id, ownerId: session.user.id },
  });

  revalidatePath("/space/recruitment");
  revalidatePath("/space/recruitment/teams");
  redirect("/space/recruitment");
}

export async function removeMember(formData: FormData) {
  const session = await requireUser();

  const membershipId = String(formData.get("membershipId"));
  const rosterId = String(formData.get("rosterId"));

  // Only the roster owner can remove members, and never themselves here.
  await prisma.rosterMembership.deleteMany({
    where: {
      id: membershipId,
      userId: { not: session.user.id },
      roster: { ownerId: session.user.id },
    },
  });

  revalidatePath(`/space/recruitment/rosters/${rosterId}`);
}

// --- Invitations ---

export async function invitePlayer(toUserId: string, formData: FormData) {
  const session = await requireUser();

  const rosterId = String(formData.get("rosterId"));

  // Verify the roster belongs to the current user.
  const roster = await prisma.roster.findFirst({
    where: { id: rosterId, ownerId: session.user.id },
  });
  if (!roster) {
    return;
  }

  // Skip if the target is already a member.
  const alreadyMember = await prisma.rosterMembership.findUnique({
    where: { rosterId_userId: { rosterId, userId: toUserId } },
  });
  if (alreadyMember) {
    return;
  }

  const { message } = invitationSchema.parse({
    message: formData.get("message"),
  });

  // Upsert so a previously declined invitation can be re-sent.
  await prisma.invitation.upsert({
    where: { rosterId_toUserId: { rosterId, toUserId } },
    update: {
      status: "PENDING",
      message,
      fromUserId: session.user.id,
      respondedAt: null,
    },
    create: {
      rosterId,
      toUserId,
      fromUserId: session.user.id,
      message,
    },
  });

  revalidatePath("/space/recruitment/players");
  revalidatePath(`/space/recruitment/rosters/${rosterId}`);
}

export async function respondInvitation(
  invitationId: string,
  accept: boolean,
) {
  const session = await requireUser();

  const invitation = await prisma.invitation.findFirst({
    where: { id: invitationId, toUserId: session.user.id, status: "PENDING" },
  });
  if (!invitation) {
    return;
  }

  if (accept) {
    await prisma.rosterMembership.upsert({
      where: {
        rosterId_userId: {
          rosterId: invitation.rosterId,
          userId: session.user.id,
        },
      },
      update: {},
      create: { rosterId: invitation.rosterId, userId: session.user.id },
    });
  }

  await prisma.invitation.update({
    where: { id: invitation.id },
    data: {
      status: accept ? "ACCEPTED" : "DECLINED",
      respondedAt: new Date(),
    },
  });

  revalidatePath("/space/recruitment");
  revalidatePath("/space/recruitment/invitations");
  revalidatePath(`/space/recruitment/rosters/${invitation.rosterId}`);
}
