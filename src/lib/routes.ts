/** Central place for app URLs so links never drift from the route tree. */
export const routes = {
  home: "/",
  newTask: "/tasks/new",
  task: (id: string) => `/tasks/${id}`,
  editTask: (id: string) => `/tasks/${id}/edit`,
} as const;
