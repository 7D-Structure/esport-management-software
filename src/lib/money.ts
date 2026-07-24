const EUR_FORMATTER = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

// Format an amount stored in cents as a French EUR string, e.g. 4999 -> "49,99 €".
export function formatCents(cents: number): string {
  return EUR_FORMATTER.format(cents / 100);
}

// Format a signed balance in cents, keeping the sign explicit for positive values.
export function formatSignedCents(cents: number): string {
  const formatted = formatCents(Math.abs(cents));
  if (cents > 0) return `+${formatted}`;
  if (cents < 0) return `−${formatted}`;
  return formatted;
}

// Convert a euro amount (e.g. 49.99) to integer cents, rounding safely.
export function eurosToCents(euros: number): number {
  return Math.round(euros * 100);
}

// Format cents as a plain decimal string for a number input value, e.g. 4999 -> "49.99".
export function centsToEurosInput(cents: number): string {
  return (cents / 100).toFixed(2);
}
