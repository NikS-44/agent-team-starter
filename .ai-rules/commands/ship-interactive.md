---
description: Full ship pipeline with mandatory human check-ins on risky or non-obvious decisions
---
Feature spec: $ARGUMENTS

You are the **Lead** with **mandatory check-ins** before any controversial or non-straightforward move. **Branch and PR scope** matches **`.ai-rules/agents/lead.md`**. The pipeline is the same family as **`/ship`**, but you **do not** skip clarification, and you **stop and ask** the user (prefer **Cursor AskQuestion**; if unavailable, list numbered options in chat and wait) whenever impact is high, ambiguous, or would normally **BLOCK** in critic review.

**vs `/ship`:** more pauses, more questions, fewer “just decide” moves. For small mechanical fixes, prefer **`/ship-light`**.

**UI + Chrome MCP:** Same as `/ship` — **chrome-devtools-verify** when MCP works; note skips in **Verification**.

**Check in before going forward when** (non-exhaustive):

- **API / schema / data model** (Zod shapes, routes, breaking clients)
- **Scope cuts** (in vs out of this PR)
- **Security, PII, auth, logging, storage**
- **New dependencies** or heavy patterns
- **Test strategy** (MSW vs integration, E2E vs unit, what to mock)
- **UX / a11y tradeoffs** (error copy, loading, keyboard paths)
- **Critic** would **BLOCK**, or the architect flags **non-trivial** risk
- **Coverage** cannot meet the gate in `vite.config.ts` or the aspirational 100% — **do not** implement a waiver without explicit user approval (issue link, owner, or deadline as they require)

0. **Branch** — `.ai-rules/agents/lead.md`.

1. **Clarify** — list ambiguities; **ask and wait** before `architect`.
2. `architect` → plan, then **present the plan and open decision points**; **confirm** before `critic` if anything is still fuzzy.
3. `critic` on plan — if **BLOCK**, **summarize and ask the user** how to resolve (max 2 critic rounds, then escalate like `/ship`). Do not jump to tests while blocked without user direction.
4. `builder` Phase 1 — tests only, then **confirm** the test plan (especially errors, boundaries, loading) if non-obvious.
5. `critic` on tests — if **BLOCK**, **ask** the user before rewriting (max 2 rounds, then escalate).
6. `builder` Phase 2–3 — implement, fallow, DevTools, **drizzle-db-verify** if db/server, screenshots under `verification/…`. At any **controversial** refactor, **check in** instead of defaulting. **`pnpm verify` green**, including **client Vitest coverage** (`test.coverage`).
7. `pnpm fallow audit --format json` — `fail` → one builder round (escalate if stuck).
8. `reviewer` — BLOCK? one small fix round.
9. **Commit / push / PR** — same as `/ship`, including **Coverage** numbers and any waiver text; **`gh pr create` / `gh pr view`**.

10. Stop if budget exceeded; summarize and hand off.
