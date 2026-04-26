/**
 * **Demo only** — partial line/branch coverage on purpose, for `pnpm test:coverage`
 * and hand-rolled PR patch / check-run demos. Not used by the app shell.
 */
export function partialDemoBranch(mode: "alpha" | "beta"): { tag: string } {
  if (mode === "alpha") {
    return { tag: "alpha" };
  }
  return { tag: "beta" };
}
