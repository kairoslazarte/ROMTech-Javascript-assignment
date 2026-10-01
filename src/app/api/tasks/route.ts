import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { jsonData, parseJsonBody } from "@/lib/api";
import { routes } from "@/lib/routes";
import { parseTaskFilters } from "@/lib/tasks/filters";
import { createTask, listTasks } from "@/lib/tasks/repository";
import { createTaskSchema } from "@/lib/tasks/schema";

/** GET /api/tasks?q=&status=&priority= */
export async function GET(request: NextRequest) {
  const filters = parseTaskFilters(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  return jsonData(await listTasks(filters));
}

/** POST /api/tasks */
export async function POST(request: NextRequest) {
  const body = await parseJsonBody(request, createTaskSchema);
  if (!body.ok) return body.error;

  const task = await createTask(body.data);
  revalidatePath(routes.home);

  return jsonData(task, {
    status: 201,
    headers: { Location: `/api/tasks/${task.id}` },
  });
}
