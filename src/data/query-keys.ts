// Central registry of TanStack Query cache keys. Keeping them in one place
// keeps invalidation/seeding consistent and avoids typo'd string keys spread
// across the codebase.
export const queryKeys = {
  health: ["health"] as const,
  items: {
    all: ["items"] as const,
    detail: (id: string) => ["items", id] as const,
  },
};
