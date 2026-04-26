export const queryKeys = {
  auth: {
    current: () => ["auth", "current"] as const,
  },
  users: {
    all: () => ["users"] as const,
  },
  shipVerify: {
    all: () => ["ship-verify"] as const,
  },
  shipReport: {
    diff: (path: string) => ["ship-report", "diff", path] as const,
  },
} as const;
