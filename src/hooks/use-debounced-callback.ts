import { useCallback, useEffect, useRef } from "react";

/**
 * Returns `[debounced, cancel]`. `debounced` delays calling `callback` until
 * `delayMs` have passed without another call; `cancel` drops a pending call.
 *
 * Both functions are stable across renders and the latest `callback` is
 * always the one invoked, so callers don't need to memoize it. Any pending
 * call is dropped on unmount.
 */
export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs: number,
): readonly [debounced: (...args: TArgs) => void, cancel: () => void] {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => clearTimeout(timeoutRef.current), []);

  const debounced = useCallback(
    (...args: TArgs) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => callbackRef.current(...args),
        delayMs,
      );
    },
    [delayMs],
  );

  useEffect(() => cancel, [cancel]);

  return [debounced, cancel];
}
