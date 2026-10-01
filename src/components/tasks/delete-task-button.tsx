"use client";

import { useTransition } from "react";

import { useToast } from "@/components/toast/toast-provider";
import { Button } from "@/components/ui/button";
import { deleteTaskAction } from "@/lib/tasks/actions";

interface DeleteTaskButtonProps {
  taskId: string;
  taskTitle: string;
}

export function DeleteTaskButton({ taskId, taskTitle }: DeleteTaskButtonProps) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete "${taskTitle}"? This cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      // On success the action redirects, so a result only comes back on failure.
      const result = await deleteTaskAction(taskId);
      if (!result.ok) toast.error(result.error);
    });
  }

  return (
    <Button variant="danger" onClick={handleClick} disabled={isPending}>
      {isPending ? "Deleting…" : "Delete"}
    </Button>
  );
}
