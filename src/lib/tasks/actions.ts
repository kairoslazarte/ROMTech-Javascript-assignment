"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { err, ok, type Result } from "@/lib/result";
import { routes } from "@/lib/routes";

import type { TaskFormState, TaskFormValues } from "./form-state";
import * as tasks from "./repository";
import { createTaskSchema } from "./schema";
import { isTaskStatus, type Task, type TaskStatus } from "./types";

function readFormValues(formData: FormData): TaskFormValues {
  const read = (name: keyof TaskFormValues) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };

  return {
    title: read("title"),
    description: read("description"),
    status: read("status"),
    priority: read("priority"),
    dueDate: read("dueDate"),
  };
}

function validationError(
  error: z.ZodError<z.infer<typeof createTaskSchema>>,
  values: TaskFormValues,
): TaskFormState {
  return {
    status: "error",
    message: "Please fix the highlighted fields.",
    fieldErrors: z.flattenError(error).fieldErrors,
    values,
  };
}

function revalidateTask(id: string) {
  revalidatePath(routes.home);
  revalidatePath(routes.task(id));
}

export async function createTaskAction(
  _prevState: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const values = readFormValues(formData);
  const parsed = createTaskSchema.safeParse(values);

  if (!parsed.success) return validationError(parsed.error, values);

  const task = await tasks.createTask(parsed.data);

  revalidatePath(routes.home);
  redirect(routes.task(task.id));
}

/** Bind the task id on the server: `updateTaskAction.bind(null, task.id)`. */
export async function updateTaskAction(
  id: string,
  _prevState: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const values = readFormValues(formData);
  const parsed = createTaskSchema.safeParse(values);

  if (!parsed.success) return validationError(parsed.error, values);

  const task = await tasks.updateTask(id, parsed.data);

  if (!task) {
    return {
      status: "error",
      message: "This task no longer exists.",
      fieldErrors: {},
      values,
    };
  }

  revalidateTask(id);
  redirect(routes.task(id));
}

export async function updateTaskStatusAction(
  id: string,
  status: TaskStatus,
): Promise<Result<Task>> {
  // Server Actions are public endpoints, so arguments are re-checked at
  // runtime even though the signature is typed.
  if (!isTaskStatus(status)) return err("Invalid status.");

  const task = await tasks.updateTask(id, { status });
  if (!task) return err("This task no longer exists.");

  revalidateTask(id);
  return ok(task);
}

export async function deleteTaskAction(id: string): Promise<Result<never>> {
  const deleted = await tasks.deleteTask(id);
  if (!deleted) return err("This task no longer exists.");

  revalidateTask(id);
  redirect(routes.home);
}
