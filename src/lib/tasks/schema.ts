import { z } from "zod";

import { TASK_PRIORITIES, TASK_STATUSES } from "./types";

const taskFields = {
  title: z
    .string("Title is required.")
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(80, "Title must be 80 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer."),
  status: z.enum(TASK_STATUSES, "Choose a valid status."),
  priority: z.enum(TASK_PRIORITIES, "Choose a valid priority."),
  // An empty date input submits "", which means "no due date".
  dueDate: z.preprocess(
    (value) => (value === "" ? null : value),
    z.iso.date("Enter a valid date.").nullable(),
  ),
};

/** Payload for creating a task. Only `title` is mandatory. */
export const createTaskSchema = z.object({
  title: taskFields.title,
  description: taskFields.description.default(""),
  status: taskFields.status.default("todo"),
  priority: taskFields.priority.default("medium"),
  dueDate: taskFields.dueDate.default(null),
});

/** Payload for a partial update. At least one field must be present. */
export const updateTaskSchema = z
  .object(taskFields)
  .partial()
  .refine((patch) => Object.keys(patch).length > 0, {
    message: "Provide at least one field to update.",
  });

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
