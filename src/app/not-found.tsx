import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        The page or task you are looking for does not exist.
      </p>
      <Link href={routes.home} className={buttonStyles()}>
        Back to tasks
      </Link>
    </div>
  );
}
