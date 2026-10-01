import { NextResponse } from "next/server";
import { z } from "zod";

import { err, ok, type Result } from "@/lib/result";

/** Every API response is one of these two envelopes. */
export type ApiSuccess<T> = { data: T };
type FieldErrors = Partial<Record<string, string[]>>;
export type ApiError = {
  error: { message: string; fieldErrors?: FieldErrors };
};

export function jsonData<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ data }, init);
}

export function jsonError(
  message: string,
  status: number,
  fieldErrors?: FieldErrors,
) {
  return NextResponse.json<ApiError>(
    { error: { message, ...(fieldErrors && { fieldErrors }) } },
    { status },
  );
}

/**
 * Reads and validates a JSON request body against a schema. On failure the
 * error side already holds the right HTTP response (400 or 422) to return.
 */
export async function parseJsonBody<TSchema extends z.ZodType>(
  request: Request,
  schema: TSchema,
): Promise<Result<z.infer<TSchema>, NextResponse<ApiError>>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return err(jsonError("Request body must be valid JSON.", 400));
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    const { formErrors, fieldErrors } = z.flattenError(parsed.error);
    const hasFieldErrors = Object.keys(fieldErrors).length > 0;

    return err(
      jsonError(
        formErrors[0] ?? "Validation failed.",
        422,
        hasFieldErrors ? fieldErrors : undefined,
      ),
    );
  }

  return ok(parsed.data);
}
