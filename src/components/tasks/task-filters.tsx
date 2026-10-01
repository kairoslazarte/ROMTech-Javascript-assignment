"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { controlStyles } from "@/components/ui/field";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { hasActiveFilters, toQueryString } from "@/lib/tasks/filters";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskFilters as Filters,
} from "@/lib/tasks/types";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 300;

interface TaskFiltersProps {
  /** The filters currently applied, as parsed from the URL on the server. */
  filters: Filters;
}

/**
 * The URL is the source of truth for filters: changing a control navigates,
 * and the server re-renders the list. That keeps filtered views shareable
 * and makes the back button work without any client-side store.
 */
export function TaskFilters({ filters }: TaskFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  // Only the search box needs local state, so typing stays responsive while
  // navigation is debounced.
  const [query, setQuery] = useState(filters.query ?? "");

  function applyFilters(next: Filters) {
    startTransition(() => {
      router.replace(`${pathname}${toQueryString(next)}`, { scroll: false });
    });
  }

  const [applyQueryDebounced, cancelPendingQuery] = useDebouncedCallback(
    (value: string) => {
      applyFilters({ ...filters, query: value.trim() || undefined });
    },
    SEARCH_DEBOUNCE_MS,
  );

  function handleQueryChange(value: string) {
    setQuery(value);
    applyQueryDebounced(value);
  }

  function handleSelectChange(key: "status" | "priority", value: string) {
    cancelPendingQuery();
    // parseTaskFilters validates the value again once it is back in the URL.
    applyFilters({
      ...filters,
      query: query.trim() || undefined,
      [key]: value || undefined,
    });
  }

  function handleClear() {
    cancelPendingQuery();
    setQuery("");
    applyFilters({});
  }

  const canClear = hasActiveFilters(filters) || query !== "";

  return (
    <div
      role="search"
      aria-busy={isPending}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <input
        type="search"
        aria-label="Search tasks"
        placeholder="Search tasks…"
        value={query}
        onChange={(event) => handleQueryChange(event.target.value)}
        className={cn(controlStyles, "sm:flex-1")}
      />

      <select
        aria-label="Filter by status"
        value={filters.status ?? ""}
        onChange={(event) => handleSelectChange("status", event.target.value)}
        className={cn(controlStyles, "sm:w-40")}
      >
        <option value="">All statuses</option>
        {TASK_STATUSES.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by priority"
        value={filters.priority ?? ""}
        onChange={(event) => handleSelectChange("priority", event.target.value)}
        className={cn(controlStyles, "sm:w-40")}
      >
        <option value="">All priorities</option>
        {TASK_PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {PRIORITY_LABELS[priority]}
          </option>
        ))}
      </select>

      <Button variant="secondary" onClick={handleClear} disabled={!canClear}>
        Clear
      </Button>
    </div>
  );
}
