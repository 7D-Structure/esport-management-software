import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { EventForm } from "../event-form";
import { deleteEvent, updateEvent } from "../actions";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [event, teams] = await Promise.all([
    prisma.event.findUnique({ where: { id } }),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!event) {
    notFound();
  }

  const updateEventWithId = updateEvent.bind(null, id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{event.title}</h1>
        <form action={deleteEvent}>
          <input type="hidden" name="id" value={event.id} />
          <button
            type="submit"
            className="text-sm text-red-600 hover:underline"
          >
            Supprimer l&apos;événement
          </button>
        </form>
      </div>

      <EventForm
        action={updateEventWithId}
        teams={teams}
        defaults={event}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
