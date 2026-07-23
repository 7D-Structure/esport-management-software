import { requireUser } from "@/lib/require-user";
import { createGoal } from "../actions";
import { GoalForm } from "../goal-form";

export default async function NewGoalPage() {
  await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nouvel objectif</h1>
      </div>
      <GoalForm action={createGoal} submitLabel="Créer" />
    </div>
  );
}
