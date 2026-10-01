import { notFound } from "next/navigation";
import { cache } from "react";

import { findTask } from "./repository";
import type { Task } from "./types";

/**
 * Loads a task for a page, or renders the not-found UI.
 *
 * Wrapped in React `cache` so `generateMetadata` and the page component share
 * a single lookup per request.
 */
export const getTaskOrNotFound = cache(async (id: string): Promise<Task> => {
  const task = await findTask(id);
  if (!task) notFound();

  return task;
});
