import { hasActiveFilters } from "@/lib/tasks/filters";
import { listTasks } from "@/lib/tasks/repository";
import type { TaskFilters } from "@/lib/tasks/types";

import { TaskCard } from "./task-card";

/** Async Server Component: fetches its own data so it can stream in. */
export async function TaskList({ filters }: { filters: TaskFilters }) {
  const tasks = await listTasks(filters);

  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-12 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        {hasActiveFilters(filters)
          ? "No tasks match your filters."
          : "No tasks yet. Create your first one to get started."}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard task={task} />
        </li>
      ))}
    </ul>
  );
}

export function TaskListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <ul aria-hidden className="flex flex-col gap-3">
      {Array.from({ length: rows }, (_, index) => (
        <li
          key={index}
          className="h-24 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"
        />
      ))}
    </ul>
  );
}
