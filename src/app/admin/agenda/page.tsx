import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  EVENT_STATUS_LABELS,
  EVENT_TYPE_COLORS,
  EVENT_TYPE_LABELS,
} from "@/lib/labels";
import { formatEventRange } from "@/lib/datetime";
import { getMonthInfo, parseMonthParam } from "@/lib/calendar";
import { MonthCalendar } from "./month-calendar";

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { organization } = await requireAdmin();

  const { month: monthParam } = await searchParams;
  const { year, month } = parseMonthParam(monthParam);
  const info = getMonthInfo(year, month);

  const [monthEvents, upcomingEvents] = await Promise.all([
    prisma.event.findMany({
      where: {
        organizationId: organization.id,
        startsAt: { gte: info.gridStart, lt: info.gridEnd },
      },
      orderBy: { startsAt: "asc" },
    }),
    prisma.event.findMany({
      where: {
        organizationId: organization.id,
        startsAt: { gte: new Date() },
      },
      orderBy: { startsAt: "asc" },
      take: 8,
      include: { team: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Agenda &amp; scrims</h1>
          <p className="text-sm text-neutral-500">
            Planifiez et suivez scrims, entraînements, matchs et réunions.
          </p>
        </div>
        <Link
          href="/admin/agenda/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          + Nouvel événement
        </Link>
      </div>

      <MonthCalendar year={year} month={month} events={monthEvents} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">À venir</h2>
        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-neutral-500">Aucun événement à venir.</p>
        ) : (
          <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 dark:divide-neutral-900 dark:border-neutral-800">
            {upcomingEvents.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/admin/agenda/${event.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      EVENT_TYPE_COLORS[event.type] ?? "bg-neutral-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="truncate font-medium">
                        {event.title}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {EVENT_TYPE_LABELS[event.type]}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-500">
                      {formatEventRange(event.startsAt, event.endsAt)}
                      {event.team ? ` · ${event.team.name}` : ""}
                      {event.opponent ? ` · vs ${event.opponent}` : ""}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-neutral-500">
                    {EVENT_STATUS_LABELS[event.status]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
