---
description: Fast ship — fewer subagents, with verification report step
---
Feature spec: $ARGUMENTS

You are the **Lead** for small, well-scoped work. Faster than full `/ship`; use `/ship` if the spec is large, unclear, or high-risk.

**vs `/ship`:** no plan critic, test critic, or `reviewer` (unless you skim yourself).

**vs `/ship-interactive`:** this flow stays fast; for mandatory pauses to confirm risky decisions, use **`/ship-interactive`**.

**Branch first:** Same rules as full **`/ship`** — `.ai-rules/agents/lead.md`.

**UI + Chrome MCP:** If the diff touches app UI or routing (see `CLAUDE.md`), run **chrome-devtools-verify** when MCP works; else note “MCP skipped” in **Verification**. Tests + fallow still gate.

**Tools:** `/memory` if repeating prefs. Fallow: MCP (`fallow_audit`…) when available. Builder handoff: Fallow in loop; **drizzle-db-verify** for db/server; UI routes → DevTools + screenshots under `verification/<branch-or-ticket>/` for the gist script (step 7). Optional: auto-memory or tiny `CLAUDE.md` after recurring pitfalls.

**Pipeline**
1. **Plan** — Short bullets: goal, files, risks. `architect` only if spec is fuzzy. No plan critic.
2. **Build** — One `builder` pass: implement, tests, `pnpm typecheck && pnpm lint && pnpm test:coverage && pnpm build` (or `pnpm verify` when in doubt), UI per `agents/builder.md` Phase 3 (fallow + DevTools if MCP up).
3. **Lead fix** — At most one follow-up to `builder` if not green.
4. **Fallow** — `fallow_audit` or `pnpm fallow audit --format json`. `fail` → fix once or hand off to full `/ship`.
5. **Verification (UI/routes + MCP)** — Optional spot-check: screenshots, console/network, `/ship-report` if relevant. PR body always has a **Verification** section. No MCP → say so; green tests can still ship.
6. **Skim diff** — Zod at boundaries, query keys, no `any` / stray logs, tests for main paths.
7. **Ship** — Commit, push, **open** PR (or add to an **open** PR only if same feature). **`gh pr create`** body includes verification + local paths under `verification/…`. Merged old PR or wrong scope → you should already be on a new branch. **Images:** for UI, if PNGs exist: `scripts/pr-comment-verify-gist.sh <PR#> a.png b.png` (needs `gh auth`; `VERIFY_GIST_PUBLIC=1` for public gist). Don’t `git add` verification PNGs unless asked. Gist and `gh` may reject raw binary — use script or browser-upload gist; see **chrome-devtools-verify**.
8. Exceeded one fix round or fallow still `fail` after one try → **stop**; suggest `/ship`.
