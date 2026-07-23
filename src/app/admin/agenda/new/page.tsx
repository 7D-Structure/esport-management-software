import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { createEvent } from "../actions";
import { EventForm } from "../event-form";

export default async function NewEventPage() {
  await requireAdmin();

  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nouvel événement</h1>
      </div>
      <EventForm action={createEvent} teams={teams} submitLabel="Créer" />
    </div>
  );
}
