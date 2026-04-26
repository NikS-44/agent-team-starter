import path from "node:path";
import picomatch from "picomatch";

/**
 * Must stay aligned with `vite.config.ts` `test.coverage` — single source
 * of truth for which client files count toward Vitest V8 coverage and
 * hand-rolled patch/diff reports.
 */
export const VITEST_COVERAGE_INCLUDE = ["src/**/*.{ts,tsx}"] as const;

export const VITEST_COVERAGE_EXCLUDE = [
  "**/*.d.ts",
  "**/*.{test,spec}.{ts,tsx}",
  "src/main.tsx",
  "src/mocks/**",
  "src/test/**",
  "src/**/components/ui/**",
  "src/pages/components-demo/**",
  "src/**/*Types.ts",
] as const;

const inclusionMatchers = VITEST_COVERAGE_INCLUDE.map((g) => picomatch(g, { dot: true }));
const exclusionMatchers = VITEST_COVERAGE_EXCLUDE.map((g) => picomatch(g, { dot: true }));

/** Paths use forward slashes, repo-relative, no leading `./` */
export function isClientCoverageSourceFile(relativePath: string): boolean {
  const p = path.normalize(relativePath).split(path.sep).join("/");
  if (!p || p === ".") {
    return false;
  }
  if (!inclusionMatchers.some((m) => m(p))) {
    return false;
  }
  if (exclusionMatchers.some((m) => m(p))) {
    return false;
  }
  return true;
}
