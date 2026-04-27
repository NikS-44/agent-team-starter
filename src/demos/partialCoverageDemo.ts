/** **Demo only** — used by `pnpm test:coverage` demos; not used by the app shell. */
export function partialDemoBranch(mode: "alpha" | "beta"): { tag: string } {
  if (mode === "alpha") {
    return { tag: "alpha" };
  }
  return { tag: "beta" };
}
