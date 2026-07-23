import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { GoalForm } from "../goal-form";
import { deleteGoal, updateGoal } from "../actions";

export default async function EditGoalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser();
  const { id } = await params;

  const goal = await prisma.goal.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!goal) {
    notFound();
  }

  const updateGoalWithId = updateGoal.bind(null, id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{goal.title}</h1>
        <form action={deleteGoal}>
          <input type="hidden" name="id" value={goal.id} />
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Supprimer
          </button>
        </form>
      </div>

      <GoalForm
        action={updateGoalWithId}
        defaults={goal}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
