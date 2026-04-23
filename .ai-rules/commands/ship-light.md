---
description: Fast ship — fewer subagents, with verification report step
---
Feature spec: $ARGUMENTS

You are the Lead. Use this path for small or well-scoped work and when you want **fast models** with minimal orchestration. It trades the full `/ship` review loops for speed; escalate to full `/ship` if the spec is large, risky, or ambiguous.

**Not included vs `/ship`:** plan critic, test critic, and the `reviewer` subagent (unless you add a manual skim).

**UI / route + Chrome MCP (conditional):** If the diff touches production UI or routing (see **CLAUDE.md** — typically `src/pages/**`, `src/components/**`, `src/router.ts`, shell layout, `src/index.css`; **not** changes confined to tests/mocks alone), then **when Chrome DevTools MCP is connected and working**, run **chrome-devtools-verify** in step 5 (Lead and/or builder) and capture screenshots under `verification/…`. **If MCP is not available** in this session, document that in the PR **Verification** section and proceed — Vitest/build/fallow still gate quality; browser checks are **expected when MCP works**, not an absolute blocker.

**Tools & memory**

- **`/memory`:** At kickoff, use it when the spec might repeat a past correction or preference; confirm which `CLAUDE.md` / rules loaded. After a successful PR, persist durable learnings via auto memory or a minimal `CLAUDE.md` edit (keep both tight).
- **Fallow:** Prefer **Fallow MCP** tools (`fallow_audit`, `fallow_health`, `fallow_dead_code`) per `CLAUDE.md` instead of relying only on `pnpm fallow` CLI when those tools are available—especially in step 4.
- **Research:** Optional `architect` already has **WebFetch**. The Lead may use web research / fetch tools when the spec depends on external APIs or documentation.
- **Builder handoff:** In your single builder message, require Fallow MCP for audit/dead-code/health loops when available; Phase 3 **Chrome DevTools** for UI/routes **when MCP is working** (otherwise note MCP skipped); **drizzle-db-verify** when DB/server/schema changes; when browser MCP runs, require **`take_screenshot`** with **`filePath`** under **`verification/<branch-or-ticket>/`** so the Lead can use the gist script (step 7). Ask for a short auto-memory or `CLAUDE.md` note if the work surfaced a recurring pitfall—before signalling done.

Pipeline:

1. **Plan (inline):** Write a short plan: goal, files to touch, main risks (bullets only). Spawn `architect` **once** only if the spec is unclear; there is **no** `critic` round-trip on the plan.
2. **Build:** Spawn `builder` **once** with: implement the plan, write or update tests alongside the code (TDD when natural), match `CLAUDE.md`, run `pnpm typecheck && pnpm lint && pnpm test && pnpm build` before signalling done, and for **UI / route work** complete Phase 3 in `.ai-rules/agents/builder.md` (fallow + **Chrome DevTools MCP when it is working** — see builder 3b) before signalling done.
3. **Lead sanity check:** If builder’s tree is not green, send **at most one** short fix round to `builder` (same budget as a single reviewer pass in full `/ship`).
4. **Fallow:** Run audit yourself via **Fallow MCP** (`fallow_audit`) or `pnpm fallow audit --format json`. If verdict is `fail`, fix with `builder` **or** stop and recommend full `/ship`.
5. **Verification report (UI / route changes):** When the diff touches UI or routes **and Chrome DevTools MCP is working**, you (the Lead) should run or spot-check **chrome-devtools-verify**: screenshots under `verification/<branch-or-ticket>/`, console/network per CLAUDE.md, **`/ship-report`** when nav or ship workflow is in scope. **Always** add a “Verification” section to the PR body. On-disk paths feed step 7’s gist script. **If MCP is not available**, state that plainly in **Verification** and rely on automated tests — still ship if fallow/tests/build are green.
6. **Lead diff review (no `reviewer` agent):** Skim the diff for `CLAUDE.md` basics (Zod at API boundaries, query key factory, no `any` / stray `console.log`, tests for happy + error/empty where relevant).
7. If the above passes: commit, push the worktree branch, then open or reuse a PR:
   - **`gh pr create`** (or use the existing PR number from `gh pr view --json number` if the branch already has one) with a concise title and body that **includes the verification report** and the **local** screenshot paths under `verification/…` (for traceability). No reviewer-generated prose.
   - **Inline images on the PR (no binary commits):** When the change touched **UI or routes** and there are **PNG (or other) image files on disk** from step 5 (typically under `verification/<branch-or-ticket>/`), run from the repo root—**once**, with **all** images in a single invocation so one comment holds the full set:
     ```bash
     scripts/pr-comment-verify-gist.sh <PR_NUMBER> path/to/first.png [path/to/second.png ...]
     ```
     Requires **`gh` authenticated** (`gh auth login`). Default gist is **secret (unlisted)**; set **`VERIFY_GIST_PUBLIC=1`** only if you need a **public** gist. **Do not** `git add` those verification images unless the user explicitly wants them in the repo. Details and manual fallback: **chrome-devtools-verify** skill (“PR thread only — gist + `gh`”).
   - If there are **no** screenshot files on disk (MCP unused or unavailable), **skip** the gist script; the PR **Verification** section should still say what was checked (browser or tests only). If the change is **backend-only**, skip the gist script.
8. If you would exceed one builder fix round or fallow stays failing after one attempt, **stop** and summarize; suggest full `/ship`.
