/**
 * Explicit success/failure return type for operations that can fail in
 * expected ways. Callers must narrow on `ok` before touching `data` or `error`.
 */
export type Result<T, E = string> =
  { ok: true; data: T } | { ok: false; error: E };

export const ok = <T>(data: T): Result<T, never> => ({ ok: true, data });

export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
