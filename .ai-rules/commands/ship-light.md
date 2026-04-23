---
description: Fast ship — fewer subagents, with verification report step
---
Feature spec: $ARGUMENTS

You are the Lead. Use this path for small or well-scoped work and when you want **fast models** with minimal orchestration. It trades the full `/ship` review loops for speed; escalate to full `/ship` if the spec is large, risky, or ambiguous.

**Not included vs `/ship`:** plan critic, test critic, and the `reviewer` subagent (unless you add a manual skim).

**Tools & memory**

- **`/memory`:** At kickoff, use it when the spec might repeat a past correction or preference; confirm which `CLAUDE.md` / rules loaded. After a successful PR, persist durable learnings via auto memory or a minimal `CLAUDE.md` edit (keep both tight).
- **Fallow:** Prefer **Fallow MCP** tools (`fallow_audit`, `fallow_health`, `fallow_dead_code`) per `CLAUDE.md` instead of relying only on `pnpm fallow` CLI when those tools are available—especially in step 4.
- **Research:** Optional `architect` already has **WebFetch**. The Lead may use web research / fetch tools when the spec depends on external APIs or documentation.
- **Builder handoff:** In your single builder message, require Fallow MCP for audit/dead-code/health loops when available; Phase 3 **Chrome DevTools** only for UI/routes; **drizzle-db-verify** (tests + live API against dev stack) when DB/server/schema changes; ask for a short auto-memory or `CLAUDE.md` note if the work surfaced a recurring pitfall—before signalling done.

Pipeline:

1. **Plan (inline):** Write a short plan: goal, files to touch, main risks (bullets only). Spawn `architect` **once** only if the spec is unclear; there is **no** `critic` round-trip on the plan.
2. **Build:** Spawn `builder` **once** with: implement the plan, write or update tests alongside the code (TDD when natural), match `CLAUDE.md`, run `pnpm typecheck && pnpm lint && pnpm test && pnpm build` before signalling done, and for **any UI or route work** complete Phase 3 in `.ai-rules/agents/builder.md` (fallow + Chrome DevTools MCP) before signalling done.
3. **Lead sanity check:** If builder’s tree is not green, send **at most one** short fix round to `builder` (same budget as a single reviewer pass in full `/ship`).
4. **Fallow:** Run audit yourself via **Fallow MCP** (`fallow_audit`) or `pnpm fallow audit --format json`. If verdict is `fail`, fix with `builder` **or** stop and recommend full `/ship`.
5. **Verification report (required for UI or route changes):** Follow the **chrome-devtools-verify** project skill: save screenshots to `verification/<branch-or-ticket>/`, confirm console/network per CLAUDE.md, and open **`/ship-report`** in the dev server to confirm the checklist page renders. **Always** add a “Verification” section to the PR body (use the blurb template on `/ship-report` or an equivalent list). If MCP is down, state that and list what you verified without it; still produce the written report.
6. **Lead diff review (no `reviewer` agent):** Skim the diff for `CLAUDE.md` basics (Zod at API boundaries, query key factory, no `any` / stray `console.log`, tests for happy + error/empty where relevant).
7. If the above passes: commit, push the worktree branch, `gh pr create` with a concise title and body that **includes the verification report** and screenshot paths, no reviewer-generated prose.
8. If you would exceed one builder fix round or fallow stays failing after one attempt, **stop** and summarize; suggest full `/ship`.
