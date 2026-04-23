---
description: Fast ship — fewer subagents, no DevTools gate (lightweight /ship)
---
Feature spec: $ARGUMENTS

You are the Lead. Use this path for small or well-scoped work and when you want **fast models** with minimal orchestration. It trades the full `/ship` review loops for speed; escalate to full `/ship` if the spec is large, risky, or ambiguous.

**Not included vs `/ship`:** plan critic, test critic, `reviewer` subagent, and the Chrome DevTools MCP phase. Run `/verify` yourself when the change is UI-heavy.

**Tools & memory**

- **`/memory`:** At kickoff, use it when the spec might repeat a past correction or preference; confirm which `CLAUDE.md` / rules loaded. After a successful PR, persist durable learnings via auto memory or a minimal `CLAUDE.md` edit (keep both tight).
- **Fallow:** Prefer **Fallow MCP** tools (`fallow_audit`, `fallow_health`, `fallow_dead_code`) per `CLAUDE.md` instead of relying only on `pnpm fallow` CLI when those tools are available—especially in step 4.
- **Research:** Optional `architect` already has **WebFetch**. The Lead may use web research / fetch tools when the spec depends on external APIs or documentation.
- **Builder handoff:** In your single builder message, require Fallow MCP for audit/dead-code/health loops when available, and ask for a short auto-memory or `CLAUDE.md` note if the work surfaced a recurring pitfall—before signalling done.

Pipeline:

1. **Plan (inline):** Write a short plan: goal, files to touch, main risks (bullets only). Spawn `architect` **once** only if the spec is unclear; there is **no** `critic` round-trip on the plan.
2. **Build:** Spawn `builder` **once** with: implement the plan, write or update tests alongside the code (TDD when natural), match `CLAUDE.md`, and run `pnpm typecheck && pnpm lint && pnpm test && pnpm build` before signalling done.
3. **Lead sanity check:** If builder’s tree is not green, send **at most one** short fix round to `builder` (same budget as a single reviewer pass in full `/ship`).
4. **Fallow:** Run audit yourself via **Fallow MCP** (`fallow_audit`) or `pnpm fallow audit --format json`. If verdict is `fail`, fix with `builder` **or** stop and recommend full `/ship`.
5. **Lead diff review (no `reviewer`):** Skim the diff for `CLAUDE.md` basics (Zod at API boundaries, query key factory, no `any` / stray `console.log`, tests for happy + error/empty where relevant).
6. If the above passes: commit, push the worktree branch, `gh pr create` with a concise title and a short body (spec summary + what changed), no reviewer-generated prose.
7. If you would exceed one builder fix round or fallow stays failing after one attempt, **stop** and summarize; suggest full `/ship`.
