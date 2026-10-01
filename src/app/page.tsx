import { Suspense } from "react";

import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskList, TaskListSkeleton } from "@/components/tasks/task-list";
import { TaskStats } from "@/components/tasks/task-stats";
import { parseTaskFilters, toQueryString } from "@/lib/tasks/filters";
import { getTaskStats } from "@/lib/tasks/repository";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const filters = parseTaskFilters(await searchParams);
  const stats = await getTaskStats();

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Track what needs doing, what is in flight and what is done.
        </p>
      </div>

      <TaskStats stats={stats} />

      <section
        aria-labelledby="task-list-heading"
        className="flex flex-col gap-4"
      >
        <h2 id="task-list-heading" className="sr-only">
          Task list
        </h2>
        <TaskFilters filters={filters} />
        {/* Keyed by the filters so the skeleton shows again on every change. */}
        <Suspense key={toQueryString(filters)} fallback={<TaskListSkeleton />}>
          <TaskList filters={filters} />
        </Suspense>
      </section>
    </>
  );
}
