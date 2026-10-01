import type { CreateTaskInput } from "./schema";
import type { Task } from "./types";

export type TaskField = keyof CreateTaskInput;

/** Raw string values as they appear in the form controls. */
export type TaskFormValues = Record<TaskField, string>;

/**
 * State threaded through `useActionState`. On a failed submission the action
 * echoes the submitted values back so the form can re-render them.
 */
export type TaskFormState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors: Partial<Record<TaskField, string[]>>;
      values: TaskFormValues;
    };

export const initialTaskFormState: TaskFormState = { status: "idle" };

export const emptyTaskFormValues: TaskFormValues = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

export function toFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ?? "",
  };
}
