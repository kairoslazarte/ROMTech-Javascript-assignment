"use client";

import { useOptimistic, useTransition, type ChangeEvent } from "react";

import { useToast } from "@/components/toast/toast-provider";
import { controlStyles } from "@/components/ui/field";
import { updateTaskStatusAction } from "@/lib/tasks/actions";
import {
  isTaskStatus,
  STATUS_LABELS,
  TASK_STATUSES,
  type TaskStatus,
} from "@/lib/tasks/types";
import { cn } from "@/lib/utils";

interface TaskStatusSelectProps {
  taskId: string;
  taskTitle: string;
  status: TaskStatus;
}

export function TaskStatusSelect({
  taskId,
  taskTitle,
  status,
}: TaskStatusSelectProps) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  // Shows the new status immediately; React reverts to the `status` prop on
  // its own if the action fails and the server never confirms the change.
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status);

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextStatus = event.target.value;
    if (!isTaskStatus(nextStatus)) return;

    startTransition(async () => {
      setOptimisticStatus(nextStatus);
      const result = await updateTaskStatusAction(taskId, nextStatus);

      if (result.ok) {
        toast.success(`Marked as ${STATUS_LABELS[nextStatus].toLowerCase()}.`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <select
      aria-label={`Status of ${taskTitle}`}
      value={optimisticStatus}
      onChange={handleChange}
      aria-busy={isPending}
      className={cn(controlStyles, "py-1.5")}
    >
      {TASK_STATUSES.map((value) => (
        <option key={value} value={value}>
          {STATUS_LABELS[value]}
        </option>
      ))}
    </select>
  );
}
