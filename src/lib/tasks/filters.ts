import { isTaskPriority, isTaskStatus, type TaskFilters } from "./types";

type RawSearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/**
 * Turns untrusted URL search params into a typed filter object. Unknown or
 * malformed values are dropped rather than rejected, so a hand-edited URL
 * degrades to "no filter" instead of an error page.
 */
export function parseTaskFilters(params: RawSearchParams): TaskFilters {
  const query = first(params.q)?.trim();
  const status = first(params.status);
  const priority = first(params.priority);

  return {
    ...(query && { query }),
    ...(isTaskStatus(status) && { status }),
    ...(isTaskPriority(priority) && { priority }),
  };
}

/** Inverse of {@link parseTaskFilters}. Returns "" when no filter is active. */
export function toQueryString(filters: TaskFilters): string {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export function hasActiveFilters(filters: TaskFilters): boolean {
  return Object.values(filters).some(Boolean);
}
