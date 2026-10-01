"use client";

import Link from "next/link";
import { useActionState, useId } from "react";

import { Button, buttonStyles } from "@/components/ui/button";
import { controlStyles, Field, fieldErrorId } from "@/components/ui/field";
import {
  emptyTaskFormValues,
  initialTaskFormState,
  type TaskField,
  type TaskFormState,
  type TaskFormValues,
} from "@/lib/tasks/form-state";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/lib/tasks/types";

interface TaskFormProps {
  /** A Server Action compatible with `useActionState`. */
  action: (state: TaskFormState, formData: FormData) => Promise<TaskFormState>;
  initialValues?: TaskFormValues;
  submitLabel: string;
  cancelHref: string;
}

export function TaskForm({
  action,
  initialValues = emptyTaskFormValues,
  submitLabel,
  cancelHref,
}: TaskFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialTaskFormState,
  );
  const formId = useId();

  const hasError = state.status === "error";
  // React resets uncontrolled fields after an action runs, so a failed
  // submission re-renders with the values the server echoed back.
  const values = hasError ? state.values : initialValues;
  const fieldErrors = hasError ? state.fieldErrors : {};

  /** Props shared by every control: ids, name, value and a11y error wiring. */
  const control = (name: TaskField) => {
    const id = `${formId}-${name}`;
    const invalid = Boolean(fieldErrors[name]?.length);

    return {
      id,
      name,
      defaultValue: values[name],
      "aria-invalid": invalid || undefined,
      "aria-describedby": invalid ? fieldErrorId(id) : undefined,
    };
  };

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {hasError && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {state.message}
        </p>
      )}

      <Field
        label="Title"
        htmlFor={`${formId}-title`}
        errors={fieldErrors.title}
      >
        <input
          {...control("title")}
          type="text"
          required
          maxLength={80}
          placeholder="What needs to be done?"
          className={controlStyles}
        />
      </Field>

      <Field
        label="Description"
        htmlFor={`${formId}-description`}
        errors={fieldErrors.description}
      >
        <textarea
          {...control("description")}
          rows={4}
          maxLength={500}
          placeholder="Optional details"
          className={controlStyles}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          label="Status"
          htmlFor={`${formId}-status`}
          errors={fieldErrors.status}
        >
          <select
            // Remounts when the value changes: React does not re-apply a
            // select's defaultValue when it resets the form after an action.
            key={values.status}
            {...control("status")}
            className={controlStyles}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Priority"
          htmlFor={`${formId}-priority`}
          errors={fieldErrors.priority}
        >
          <select
            key={values.priority}
            {...control("priority")}
            className={controlStyles}
          >
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Due date"
          htmlFor={`${formId}-dueDate`}
          errors={fieldErrors.dueDate}
        >
          <input
            {...control("dueDate")}
            type="date"
            className={controlStyles}
          />
        </Field>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Link
          href={cancelHref}
          className={buttonStyles({ variant: "secondary" })}
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
