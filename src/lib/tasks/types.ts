import { isOneOf } from "@/lib/utils";

export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
export const isTaskStatus = isOneOf(TASK_STATUSES);

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export const isTaskPriority = isOneOf(TASK_PRIORITIES);

export const STATUS_LABELS = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
} as const satisfies Record<TaskStatus, string>;

export const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
} as const satisfies Record<TaskPriority, string>;

export interface Task {
  readonly id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  /** ISO calendar date (`YYYY-MM-DD`), or `null` when there is no deadline. */
  dueDate: string | null;
  /** ISO timestamps. */
  readonly createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  query?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export type TaskStats = Record<TaskStatus, number> & {
  total: number;
  overdue: number;
};
