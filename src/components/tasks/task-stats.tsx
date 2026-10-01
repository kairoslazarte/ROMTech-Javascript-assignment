import { STATUS_LABELS, type TaskStats as Stats } from "@/lib/tasks/types";

export function TaskStats({ stats }: { stats: Stats }) {
  const items: Array<{ label: string; value: number }> = [
    { label: "Total", value: stats.total },
    { label: STATUS_LABELS.todo, value: stats.todo },
    { label: STATUS_LABELS.in_progress, value: stats.in_progress },
    { label: STATUS_LABELS.done, value: stats.done },
    { label: "Overdue", value: stats.overdue },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
          <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
