import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4">
        <Link href={routes.home} className="font-semibold tracking-tight">
          Taskboard
        </Link>
        <Link href={routes.newTask} className={buttonStyles({ size: "sm" })}>
          New task
        </Link>
      </div>
    </header>
  );
}
