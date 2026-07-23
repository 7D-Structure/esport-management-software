import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { CONTACT_TYPE_LABELS, DAY_LABELS } from "@/lib/labels";
import { CONTACT_TYPE_VALUES } from "@/lib/validation";
import { PlayerForm } from "../player-form";
import { FaceitStats } from "../faceit-stats";
import {
  addPlayerAvailability,
  addPlayerContact,
  deletePlayer,
  deletePlayerAvailability,
  deletePlayerContact,
  updatePlayer,
} from "../actions";

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [player, teams] = await Promise.all([
    prisma.player.findUnique({
      where: { id },
      include: { contacts: true, availabilities: true },
    }),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!player) {
    notFound();
  }

  const updatePlayerWithId = updatePlayer.bind(null, id);
  const addContactWithId = addPlayerContact.bind(null, id);
  const deleteContactWithId = deletePlayerContact.bind(null, id);
  const addAvailabilityWithId = addPlayerAvailability.bind(null, id);
  const deleteAvailabilityWithId = deletePlayerAvailability.bind(null, id);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {player.firstName} {player.lastName}
        </h1>
        <form action={deletePlayer}>
          <input type="hidden" name="id" value={player.id} />
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Supprimer le joueur
          </button>
        </form>
      </div>

      <PlayerForm
        action={updatePlayerWithId}
        teams={teams}
        defaults={player}
        submitLabel="Enregistrer"
      />

      {player.game === "CS2" && (
        <FaceitStats nickname={player.faceitNickname} />
      )}

      <section className="max-w-2xl space-y-4">
        <h2 className="text-lg font-semibold">Contacts</h2>
        <ul className="space-y-2">
          {player.contacts.map((contact) => (
            <li
              key={contact.id}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800"
            >
              <span>
                <span className="font-medium">
                  {CONTACT_TYPE_LABELS[contact.type]}
                </span>{" "}
                — {contact.value}
                {contact.label ? ` (${contact.label})` : ""}
              </span>
              <form action={deleteContactWithId}>
                <input type="hidden" name="id" value={contact.id} />
                <button type="submit" className="text-red-600 hover:underline">
                  Retirer
                </button>
              </form>
            </li>
          ))}
          {player.contacts.length === 0 && (
            <li className="text-sm text-neutral-500">Aucun contact.</li>
          )}
        </ul>

        <form
          action={addContactWithId}
          className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="type" className="text-sm font-medium">
              Type
            </label>
            <select
              id="type"
              name="type"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              {CONTACT_TYPE_VALUES.map((type) => (
                <option key={type} value={type}>
                  {CONTACT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="value" className="text-sm font-medium">
              Valeur
            </label>
            <input
              id="value"
              name="value"
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="label" className="text-sm font-medium">
              Libellé (optionnel)
            </label>
            <input
              id="label"
              name="label"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
          >
            Ajouter
          </button>
        </form>
      </section>

      <section className="max-w-2xl space-y-4">
        <h2 className="text-lg font-semibold">Disponibilités</h2>
        <ul className="space-y-2">
          {player.availabilities.map((availability) => (
            <li
              key={availability.id}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800"
            >
              <span>
                {DAY_LABELS[availability.dayOfWeek]} · {availability.startTime}–
                {availability.endTime}
                {availability.note ? ` (${availability.note})` : ""}
              </span>
              <form action={deleteAvailabilityWithId}>
                <input type="hidden" name="id" value={availability.id} />
                <button type="submit" className="text-red-600 hover:underline">
                  Retirer
                </button>
              </form>
            </li>
          ))}
          {player.availabilities.length === 0 && (
            <li className="text-sm text-neutral-500">
              Aucune disponibilité renseignée.
            </li>
          )}
        </ul>

        <form
          action={addAvailabilityWithId}
          className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="dayOfWeek" className="text-sm font-medium">
              Jour
            </label>
            <select
              id="dayOfWeek"
              name="dayOfWeek"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              {DAY_LABELS.map((day, index) => (
                <option key={day} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="startTime" className="text-sm font-medium">
              Début
            </label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="endTime" className="text-sm font-medium">
              Fin
            </label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="note" className="text-sm font-medium">
              Note (optionnel)
            </label>
            <input
              id="note"
              name="note"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
          >
            Ajouter
          </button>
        </form>
      </section>
    </div>
  );
}
