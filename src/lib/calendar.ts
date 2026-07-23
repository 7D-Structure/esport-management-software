// Helpers to build a month grid (Monday-first) for the agenda calendar.

export type MonthInfo = {
  year: number;
  month: number; // 0-indexed
  label: string;
  firstDay: Date;
  lastDay: Date;
  gridStart: Date; // first cell (Monday on/before the 1st)
  gridEnd: Date; // exclusive end of the grid
  weeks: Date[][]; // rows of 7 days
  prevMonthParam: string; // "YYYY-MM"
  nextMonthParam: string;
  currentMonthParam: string;
};

const MONTH_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
});

function toMonthParam(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

// Parse "YYYY-MM"; fall back to the current month when absent or invalid.
export function parseMonthParam(param?: string): { year: number; month: number } {
  if (param) {
    const match = /^(\d{4})-(\d{2})$/.exec(param);
    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]) - 1;
      if (month >= 0 && month <= 11) {
        return { year, month };
      }
    }
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

export function getMonthInfo(year: number, month: number): MonthInfo {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // JS getDay(): 0=Sunday..6=Saturday. We want Monday-first.
  const weekdayMondayFirst = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - weekdayMondayFirst);

  const weeks: Date[][] = [];
  const cursor = new Date(gridStart);
  for (let week = 0; week < 6; week++) {
    const row: Date[] = [];
    for (let day = 0; day < 7; day++) {
      row.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(row);
  }
  const gridEnd = new Date(cursor);

  const prev = new Date(year, month - 1, 1);
  const next = new Date(year, month + 1, 1);

  return {
    year,
    month,
    label: MONTH_FORMATTER.format(firstDay),
    firstDay,
    lastDay,
    gridStart,
    gridEnd,
    weeks,
    prevMonthParam: toMonthParam(prev.getFullYear(), prev.getMonth()),
    nextMonthParam: toMonthParam(next.getFullYear(), next.getMonth()),
    currentMonthParam: toMonthParam(year, month),
  };
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
