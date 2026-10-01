import type { Task } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

const daysFromNow = (days: number) => new Date(Date.now() + days * DAY_MS);
const isoDate = (date: Date) => date.toISOString().slice(0, 10);

type SeedTask = Pick<Task, "title" | "description" | "status" | "priority"> & {
  /** Offset from today, in days. Negative values are in the past. */
  dueInDays: number | null;
  createdDaysAgo: number;
};

const seeds: SeedTask[] = [
  {
    title: "Set up the Next.js project",
    description:
      "Scaffold the App Router project with TypeScript, ESLint and Tailwind CSS.",
    status: "done",
    priority: "high",
    dueInDays: -5,
    createdDaysAgo: 8,
  },
  {
    title: "Model the task domain",
    description:
      "Define the Task type, the status and priority unions, and the validation schema.",
    status: "done",
    priority: "medium",
    dueInDays: -3,
    createdDaysAgo: 7,
  },
  {
    title: "Build the task list page",
    description:
      "Server-render the list and drive search and filters from the URL.",
    status: "in_progress",
    priority: "high",
    dueInDays: 2,
    createdDaysAgo: 5,
  },
  {
    title: "Add create and edit forms",
    description:
      "Use Server Actions with useActionState for validation and pending states.",
    status: "in_progress",
    priority: "medium",
    dueInDays: 4,
    createdDaysAgo: 4,
  },
  {
    title: "Expose a REST API",
    description: "Add Route Handlers under /api/tasks for external clients.",
    status: "todo",
    priority: "low",
    dueInDays: null,
    createdDaysAgo: 2,
  },
  {
    title: "Write the README",
    description: "Document the project structure and how to run it locally.",
    status: "todo",
    priority: "medium",
    dueInDays: -1,
    createdDaysAgo: 1,
  },
];

export function createSeedTasks(): Task[] {
  return seeds.map(({ dueInDays, createdDaysAgo, ...task }, index) => {
    const createdAt = daysFromNow(-createdDaysAgo).toISOString();

    return {
      ...task,
      id: `seed-${index + 1}`,
      dueDate: dueInDays === null ? null : isoDate(daysFromNow(dueInDays)),
      createdAt,
      updatedAt: createdAt,
    };
  });
}
