import type { Metadata } from "next";
import Link from "next/link";

import { DeleteTaskButton } from "@/components/tasks/delete-task-button";
import { PriorityBadge, StatusBadge } from "@/components/tasks/task-badges";
import { TaskStatusSelect } from "@/components/tasks/task-status-select";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { getTaskOrNotFound } from "@/lib/tasks/queries";
import { isOverdue } from "@/lib/tasks/repository";
import { formatDate } from "@/lib/utils";

type TaskPageProps = PageProps<"/tasks/[id]">;

export async function generateMetadata({
  params,
}: TaskPageProps): Promise<Metadata> {
  const { id } = await params;
  const task = await getTaskOrNotFound(id);

  return { title: task.title };
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;
  const task = await getTaskOrNotFound(id);

  const details: Array<{ label: string; value: string }> = [
    {
      label: "Due",
      value: task.dueDate ? formatDate(task.dueDate) : "No due date",
    },
    { label: "Created", value: formatDate(task.createdAt) },
    { label: "Last updated", value: formatDate(task.updatedAt) },
  ];

  return (
    <>
      <Link
        href={routes.home}
        className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
      >
        ← All tasks
      </Link>

      <article className="flex flex-col gap-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <header className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {task.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {isOverdue(task) && <Badge tone="danger">Overdue</Badge>}
          </div>
        </header>

        <p className="text-sm leading-6 whitespace-pre-line text-zinc-700 dark:text-zinc-300">
          {task.description || "No description provided."}
        </p>

        <dl className="grid gap-4 border-t border-zinc-200 pt-4 text-sm sm:grid-cols-3 dark:border-zinc-800">
          {details.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-zinc-500 dark:text-zinc-400">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <TaskStatusSelect
            taskId={task.id}
            taskTitle={task.title}
            status={task.status}
          />
          <div className="flex items-center gap-3">
            <Link
              href={routes.editTask(task.id)}
              className={buttonStyles({ variant: "secondary" })}
            >
              Edit
            </Link>
            <DeleteTaskButton taskId={task.id} taskTitle={task.title} />
          </div>
        </footer>
      </article>
    </>
  );
}
