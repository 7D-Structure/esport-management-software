"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { goalSchema } from "@/lib/validation";

function readGoalForm(formData: FormData) {
  return goalSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    targetDate: formData.get("targetDate"),
    status: formData.get("status"),
  });
}

export async function createGoal(formData: FormData) {
  const session = await requireUser();

  const data = readGoalForm(formData);
  const goal = await prisma.goal.create({
    data: { ...data, userId: session.user.id },
  });

  revalidatePath("/space/goals");
  redirect(`/space/goals/${goal.id}`);
}

export async function updateGoal(goalId: string, formData: FormData) {
  const session = await requireUser();

  const data = readGoalForm(formData);
  await prisma.goal.updateMany({
    where: { id: goalId, userId: session.user.id },
    data,
  });

  revalidatePath("/space/goals");
  revalidatePath(`/space/goals/${goalId}`);
}

// Quick status change from the list (without opening the goal).
export async function setGoalStatus(formData: FormData) {
  const session = await requireUser();

  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (status !== "TODO" && status !== "IN_PROGRESS" && status !== "DONE") {
    return;
  }

  await prisma.goal.updateMany({
    where: { id, userId: session.user.id },
    data: { status },
  });

  revalidatePath("/space/goals");
}

export async function deleteGoal(formData: FormData) {
  const session = await requireUser();

  const id = String(formData.get("id"));
  await prisma.goal.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/space/goals");
  redirect("/space/goals");
}
