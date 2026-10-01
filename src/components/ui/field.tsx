import type { ReactNode } from "react";

/** Shared look for text inputs, textareas and selects. */
export const controlStyles =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500 disabled:opacity-60 aria-invalid:border-red-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

/** Id of the error element rendered by `Field`, for `aria-describedby`. */
export const fieldErrorId = (controlId: string) => `${controlId}-error`;

interface FieldProps {
  label: string;
  /** Must match the `id` of the control passed as `children`. */
  htmlFor: string;
  errors?: string[];
  children: ReactNode;
}

export function Field({ label, htmlFor, errors, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {errors?.length ? (
        <p
          id={fieldErrorId(htmlFor)}
          className="text-sm text-red-600 dark:text-red-400"
        >
          {errors.join(" ")}
        </p>
      ) : null}
    </div>
  );
}
