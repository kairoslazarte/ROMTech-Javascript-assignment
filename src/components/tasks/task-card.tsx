import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { routes } from "@/lib/routes";
import { isOverdue } from "@/lib/tasks/repository";
import type { Task } from "@/lib/tasks/types";
import { formatDate } from "@/lib/utils";

import { PriorityBadge } from "./task-badges";
import { TaskStatusSelect } from "./task-status-select";

export function TaskCard({ task }: { task: Task }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex min-w-0 flex-col gap-1.5">
        <h3 className="truncate font-medium">
          <Link
            href={routes.task(task.id)}
            className="hover:underline focus-visible:underline"
          >
            {task.title}
          </Link>
        </h3>

        {task.description && (
          <p className="line-clamp-1 text-sm text-zinc-600 dark:text-zinc-400">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <PriorityBadge priority={task.priority} />
          {task.dueDate && <span>Due {formatDate(task.dueDate)}</span>}
          {isOverdue(task) && <Badge tone="danger">Overdue</Badge>}
        </div>
      </div>

      <div className="shrink-0">
        <TaskStatusSelect
          taskId={task.id}
          taskTitle={task.title}
          status={task.status}
        />
      </div>
    </article>
  );
}
