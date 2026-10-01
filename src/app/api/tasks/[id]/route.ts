import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { jsonData, jsonError, parseJsonBody } from "@/lib/api";
import { routes } from "@/lib/routes";
import { deleteTask, findTask, updateTask } from "@/lib/tasks/repository";
import { updateTaskSchema } from "@/lib/tasks/schema";

type TaskRouteContext = RouteContext<"/api/tasks/[id]">;

const taskNotFound = () => jsonError("Task not found.", 404);

function revalidateTask(id: string) {
  revalidatePath(routes.home);
  revalidatePath(routes.task(id));
}

/** GET /api/tasks/:id */
export async function GET(_request: NextRequest, { params }: TaskRouteContext) {
  const { id } = await params;
  const task = await findTask(id);

  return task ? jsonData(task) : taskNotFound();
}

/** PATCH /api/tasks/:id */
export async function PATCH(
  request: NextRequest,
  { params }: TaskRouteContext,
) {
  const { id } = await params;

  const body = await parseJsonBody(request, updateTaskSchema);
  if (!body.ok) return body.error;

  const task = await updateTask(id, body.data);
  if (!task) return taskNotFound();

  revalidateTask(id);
  return jsonData(task);
}

/** DELETE /api/tasks/:id */
export async function DELETE(
  _request: NextRequest,
  { params }: TaskRouteContext,
) {
  const { id } = await params;

  const deleted = await deleteTask(id);
  if (!deleted) return taskNotFound();

  revalidateTask(id);
  return new Response(null, { status: 204 });
}
