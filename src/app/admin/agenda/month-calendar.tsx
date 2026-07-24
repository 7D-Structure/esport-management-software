import Link from "next/link";
import { EVENT_TYPE_COLORS } from "@/lib/labels";
import { formatEventTime } from "@/lib/datetime";
import { dayKey, getMonthInfo, isSameDay } from "@/lib/calendar";

type CalendarEvent = {
  id: string;
  title: string;
  type: string;
  status: string;
  startsAt: Date;
};

const WEEKDAY_HEADERS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function MonthCalendar({
  year,
  month,
  events,
}: {
  year: number;
  month: number;
  events: CalendarEvent[];
}) {
  const info = getMonthInfo(year, month);
  const today = new Date();

  const eventsByDay = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = dayKey(event.startsAt);
    const list = eventsByDay.get(key);
    if (list) {
      list.push(event);
    } else {
      eventsByDay.set(key, [event]);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">{info.label}</h2>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/admin/agenda?month=${info.prevMonthParam}`}
            className="rounded-md border border-neutral-300 px-3 py-1 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            ← Précédent
          </Link>
          <Link
            href="/admin/agenda"
            className="rounded-md border border-neutral-300 px-3 py-1 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            Aujourd&apos;hui
          </Link>
          <Link
            href={`/admin/agenda?month=${info.nextMonthParam}`}
            className="rounded-md border border-neutral-300 px-3 py-1 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            Suivant →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 text-sm dark:border-neutral-800 dark:bg-neutral-800">
        {WEEKDAY_HEADERS.map((day) => (
          <div
            key={day}
            className="bg-neutral-50 py-2 text-center text-xs font-medium text-neutral-500 dark:bg-neutral-950"
          >
            {day}
          </div>
        ))}

        {info.weeks.flat().map((day) => {
          const inMonth = day.getMonth() === month;
          const isToday = isSameDay(day, today);
          const dayEvents = eventsByDay.get(dayKey(day)) ?? [];

          return (
            <div
              key={day.toISOString()}
              className={`min-h-24 bg-white p-1.5 dark:bg-neutral-950 ${
                inMonth ? "" : "opacity-40"
              }`}
            >
              <div
                className={`mb-1 text-right text-xs ${
                  isToday
                    ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "text-neutral-500"
                }`}
              >
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/admin/agenda/${event.id}`}
                    className={`flex items-center gap-1 truncate rounded px-1 py-0.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                      event.status === "CANCELLED"
                        ? "text-neutral-400 line-through"
                        : ""
                    }`}
                    title={event.title}
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        EVENT_TYPE_COLORS[event.type] ?? "bg-neutral-500"
                      }`}
                    />
                    <span className="truncate">
                      {formatEventTime(event.startsAt)} {event.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
