import type { Metadata } from "next";

import { TaskForm } from "@/components/tasks/task-form";
import { routes } from "@/lib/routes";
import { updateTaskAction } from "@/lib/tasks/actions";
import { toFormValues } from "@/lib/tasks/form-state";
import { getTaskOrNotFound } from "@/lib/tasks/queries";

type EditTaskPageProps = PageProps<"/tasks/[id]/edit">;

export async function generateMetadata({
  params,
}: EditTaskPageProps): Promise<Metadata> {
  const { id } = await params;
  const task = await getTaskOrNotFound(id);

  return { title: `Edit ${task.title}` };
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  const task = await getTaskOrNotFound(id);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Edit task</h1>
      <TaskForm
        // Binding on the server keeps the id out of hidden form fields.
        action={updateTaskAction.bind(null, task.id)}
        initialValues={toFormValues(task)}
        submitLabel="Save changes"
        cancelHref={routes.task(task.id)}
      />
    </>
  );
}
