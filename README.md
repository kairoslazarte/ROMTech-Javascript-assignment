# Taskboard

A small task tracker built with **React 19**, **Next.js 16** (App Router) and **TypeScript**.

You can create, view, edit and delete tasks, change a task's status inline, and
search or filter the list. The same data is also exposed as a JSON REST API.

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

| Script              | What it does                                |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Start the development server                |
| `npm run build`     | Create a production build                   |
| `npm run start`     | Serve the production build                  |
| `npm run lint`      | Run ESLint                                  |
| `npm run typecheck` | Generate route types and run `tsc --noEmit` |

## Project structure

```
src/
├── app/                      Routes (App Router)
│   ├── layout.tsx            Root layout, fonts, metadata
│   ├── page.tsx              Task list with stats, search and filters
│   ├── error.tsx             Error boundary
│   ├── not-found.tsx         404 page
│   ├── tasks/
│   │   ├── new/              Create form
│   │   └── [id]/             Task detail and edit form
│   └── api/tasks/            REST API (Route Handlers)
├── components/
│   ├── ui/                   Generic building blocks (Button, Badge, Field)
│   ├── tasks/                Task-specific components
│   └── toast/                Toast context provider and hook
├── hooks/                    Reusable React hooks
└── lib/
    ├── tasks/                Domain: types, validation, data access, actions
    ├── api.ts                JSON response helpers for Route Handlers
    ├── result.ts             Result<T, E> type
    ├── routes.ts             Central URL builders
    └── utils.ts              Small shared helpers
```

## What is covered

### Next.js

- **App Router** with nested and dynamic routes (`/tasks/[id]`, `/tasks/[id]/edit`).
- **Server Components** by default. Pages read data directly on the server;
  only interactive pieces are Client Components.
- **Server Actions** for every mutation (`src/lib/tasks/actions.ts`), with
  `revalidatePath` and `redirect`.
- **Route Handlers** for a REST API under `/api/tasks`.
- **Streaming** with `<Suspense>` around the task list.
- **URL-driven state**: search and filters live in `searchParams`, so filtered
  views are shareable and the back button works.
- **Metadata API**, including `generateMetadata` for per-task page titles.
- `error.tsx` and `not-found.tsx` special files, and `next/font`.

### React

- `useActionState` for form submission, validation errors and pending state.
- `useOptimistic` + `useTransition` for the instant status change.
- Context with a custom hook (`ToastProvider` / `useToast`).
- A custom hook, `useDebouncedCallback`, used by the search box.
- `cache` to share one task lookup between `generateMetadata` and the page.

### TypeScript

- `strict` mode, no `any`.
- Union types derived from `as const` arrays, with matching type guards, so the
  type and its runtime check never drift apart (`src/lib/tasks/types.ts`).
- Types inferred from the Zod schemas instead of being written twice.
- Discriminated unions for form state and `Result<T, E>`.
- Generics (`isOneOf`, `parseJsonBody`, `useDebouncedCallback`), `satisfies`,
  and utility types (`Record`, `Pick`, `Partial`).
- Route-aware `PageProps`, `LayoutProps` and `RouteContext` helpers.

## REST API

| Method   | Path             | Description                                    |
| -------- | ---------------- | ---------------------------------------------- |
| `GET`    | `/api/tasks`     | List tasks. Supports `q`, `status`, `priority` |
| `POST`   | `/api/tasks`     | Create a task (`title` is required)            |
| `GET`    | `/api/tasks/:id` | Get one task                                   |
| `PATCH`  | `/api/tasks/:id` | Update any subset of fields                    |
| `DELETE` | `/api/tasks/:id` | Delete a task                                  |

Successful responses are wrapped as `{ "data": ... }` and errors as
`{ "error": { "message": "...", "fieldErrors": { ... } } }`.

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Try the API", "priority": "high"}'
```

## Notes

Tasks are kept in an in-memory store (`src/lib/tasks/repository.ts`) seeded
with sample data, so the app runs with no setup. Data resets when the server
restarts. The repository functions are async and are the only code that touches
the store, so replacing it with a real database would not change any page,
action or route handler.
