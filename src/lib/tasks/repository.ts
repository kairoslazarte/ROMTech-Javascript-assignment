import { todayIso } from "@/lib/utils";

import type { CreateTaskInput, UpdateTaskInput } from "./schema";
import { createSeedTasks } from "./seed";
import type { Task, TaskFilters, TaskStats } from "./types";

/**
 * In-memory task store.
 *
 * The functions are async and return copies on purpose: callers get the same
 * contract a real database client would give them, so swapping this module
 * for Prisma/Drizzle later would not touch any page, action or route handler.
 *
 * The store is kept on `globalThis` so it survives hot reloads in development
 * and is shared by every route bundle in the same server process.
 */
const globalForTasks = globalThis as typeof globalThis & {
  __taskStore?: Map<string, Task>;
};

const store = (globalForTasks.__taskStore ??= new Map(
  createSeedTasks().map((task) => [task.id, task]),
));

export function isOverdue(
  task: Pick<Task, "dueDate" | "status">,
  today = todayIso(),
): boolean {
  return (
    task.dueDate !== null && task.status !== "done" && task.dueDate < today
  );
}

function matchesFilters(task: Task, filters: TaskFilters): boolean {
  const { query, status, priority } = filters;

  if (status && task.status !== status) return false;
  if (priority && task.priority !== priority) return false;

  if (query) {
    const haystack = `${task.title} ${task.description}`.toLowerCase();
    if (!haystack.includes(query.toLowerCase())) return false;
  }

  return true;
}

export async function listTasks(filters: TaskFilters = {}): Promise<Task[]> {
  return [...store.values()]
    .filter((task) => matchesFilters(task, filters))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((task) => ({ ...task }));
}

export async function findTask(id: string): Promise<Task | undefined> {
  const task = store.get(id);
  return task && { ...task };
}

export async function getTaskStats(): Promise<TaskStats> {
  const today = todayIso();
  const stats: TaskStats = {
    total: store.size,
    overdue: 0,
    todo: 0,
    in_progress: 0,
    done: 0,
  };

  for (const task of store.values()) {
    stats[task.status] += 1;
    if (isOverdue(task, today)) stats.overdue += 1;
  }

  return stats;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const now = new Date().toISOString();
  const task: Task = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  store.set(task.id, task);
  return { ...task };
}

export async function updateTask(
  id: string,
  patch: UpdateTaskInput,
): Promise<Task | undefined> {
  const existing = store.get(id);
  if (!existing) return undefined;

  const updated: Task = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  store.set(id, updated);
  return { ...updated };
}

export async function deleteTask(id: string): Promise<boolean> {
  return store.delete(id);
}
