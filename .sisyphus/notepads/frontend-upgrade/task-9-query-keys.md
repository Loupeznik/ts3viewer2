# Task 9: Query Key Factory & wrapCancelable Utility

## Completed
- Created `src/lib/queryKeys.ts` with factory functions for server, user, file, audioBot
- Created `src/lib/api.ts` with `wrapCancelable` utility function
- Build verified: zero errors

## Key Patterns

### wrapCancelable Bridge
The `wrapCancelable` function bridges TanStack Query's AbortSignal to CancelablePromise:
```typescript
export function wrapCancelable<T>(
  factory: () => CancelablePromise<T>,
  signal: AbortSignal
): Promise<T> {
  const cancelable = factory();
  signal.addEventListener("abort", () => cancelable.cancel(), { once: true });
  return cancelable;
}
```

This allows TQ to cancel API requests when queries are invalidated or unmounted.

### Query Key Factory Structure
- Hierarchical keys using `as const` for type safety
- Each domain (server, user, file, audioBot) has its own namespace
- Enables precise cache invalidation and query deduplication
- Example: `serverKeys.clients(includeQuery)` creates unique keys based on parameters

## Next Task
Task 10: Create custom hooks (useServerInfo, useClients, etc.) that use these keys and wrapCancelable
