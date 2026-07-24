import { requireUser } from "@/lib/require-user";
import { createRoster } from "../../actions";
import { RosterForm } from "../../roster-form";

export default async function NewRosterPage() {
  await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Créer une équipe</h1>
        <p className="text-sm text-neutral-500">
          Vous en serez le capitaine et pourrez inviter des joueurs.
        </p>
      </div>
      <RosterForm action={createRoster} submitLabel="Créer" />
    </div>
  );
}
