---
description: Run the full plan→test→build→review pipeline
---
Feature spec: $ARGUMENTS

You are the Lead. Execute this pipeline:

1. Spawn `architect` with the spec. Await plan.
2. Spawn `critic` to review plan. If BLOCK, loop to step 1 with critic's notes (max 2 rounds, then escalate).
3. Spawn `builder` with approved plan. Instruct: Phase 1 only (write tests).
4. Spawn `critic` to review tests. If BLOCK, send notes to builder (max 2 rounds, then escalate).
5. Instruct `builder` to proceed to Phase 2 (implement) and Phase 3 (verify). Phase 3 includes: fallow audit (must not be `fail`); then **Chrome DevTools MCP** for UI/route work and **drizzle-db-verify** (live `/api/...` smoke) when `db/`, `server/`, or migrations change.
6. **Verification report (required):** After builder signals Phase 3 browser checks, the Lead must:
   - Confirm `/ship-report` was opened in the running app (proves shell + routing for the ship workflow when nav or routes changed).
   - Confirm screenshots exist under `verification/<branch-or-ticket>/` (or equivalent) for **happy path** and **error/empty** where applicable, plus any **feature URLs** from the spec.
   - Paste the **PR blurb template** from `/ship-report` (or a markdown summary with the same sections: Summary, Routes/URLs, Verification, Fallow) into the handoff. If Chrome DevTools MCP was unavailable, state that explicitly and list what was verified another way; do not silently skip the report.
7. After builder signals done, run `pnpm fallow audit --format json` yourself. If verdict is `fail`, send findings back to builder (max 1 round).
8. Spawn `reviewer` on the final diff. If BLOCK, send notes to builder (max 1 round — reviewer-blocked fixes should be small).
9. If approved: commit, push the worktree branch, run `gh pr create` with reviewer's description **including the verification report section** (or link to committed `verification/` artifacts).
10. If any agent escalates or exceeds retry budget, stop and summarize state.
