// Format a Date as the value expected by <input type="datetime-local"> (local time).
export function toDateTimeLocalValue(date?: Date | null): string {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatEventDate(date: Date): string {
  return DATE_FORMATTER.format(date);
}

export function formatEventTime(date: Date): string {
  return TIME_FORMATTER.format(date);
}

export function formatEventRange(startsAt: Date, endsAt?: Date | null): string {
  const start = `${formatEventDate(startsAt)} · ${formatEventTime(startsAt)}`;
  if (!endsAt) return start;

  const sameDay =
    startsAt.getFullYear() === endsAt.getFullYear() &&
    startsAt.getMonth() === endsAt.getMonth() &&
    startsAt.getDate() === endsAt.getDate();

  if (sameDay) {
    return `${start} – ${formatEventTime(endsAt)}`;
  }
  return `${start} → ${formatEventDate(endsAt)} · ${formatEventTime(endsAt)}`;
}
