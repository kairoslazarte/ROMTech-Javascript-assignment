type ClassValue = string | false | null | undefined;

/** Joins conditional class names, skipping falsy values. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Builds a type guard for a readonly tuple of string literals, so the union
 * type and its runtime check are derived from a single source of truth.
 */
export function isOneOf<const T extends readonly string[]>(options: T) {
  return (value: unknown): value is T[number] =>
    typeof value === "string" && options.includes(value);
}

// Dates are formatted in UTC so server and client renders always agree.
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

/** Formats an ISO date (`2026-01-31`) or timestamp as "Jan 31, 2026". */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

/** Today's date as an ISO calendar date (`YYYY-MM-DD`). */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
