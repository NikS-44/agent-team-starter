const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3"] as const;

export function LoadingSkeleton() {
  return (
    <ul aria-label="Loading users" className="space-y-3">
      {SKELETON_KEYS.map((key) => (
        <li
          key={key}
          data-testid="skeleton-item"
          className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 dark:bg-gray-800"
        >
          <div className="mb-2 h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        </li>
      ))}
    </ul>
  );
}
