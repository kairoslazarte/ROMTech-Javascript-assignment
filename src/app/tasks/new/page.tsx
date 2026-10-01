import type { Metadata } from "next";

import { TaskForm } from "@/components/tasks/task-form";
import { routes } from "@/lib/routes";
import { createTaskAction } from "@/lib/tasks/actions";

export const metadata: Metadata = {
  title: "New task",
};

export default function NewTaskPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">New task</h1>
      <TaskForm
        action={createTaskAction}
        submitLabel="Create task"
        cancelHref={routes.home}
      />
    </>
  );
}
