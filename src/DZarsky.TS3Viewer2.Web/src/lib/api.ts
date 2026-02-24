import type { CancelablePromise } from "@/api/core/CancelablePromise";

export function wrapCancelable<T>(
  factory: () => CancelablePromise<T>,
  signal: AbortSignal
): Promise<T> {
  const cancelable = factory();
  signal.addEventListener("abort", () => cancelable.cancel(), { once: true });
  return cancelable;
}
