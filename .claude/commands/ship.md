---
description: Run the full plan→test→build→review pipeline
---
Feature spec: $ARGUMENTS

You are the Lead. Execute this pipeline:

1. Spawn `architect` with the spec. Await plan.
2. Spawn `critic` to review plan. If BLOCK, loop to step 1 with critic's notes (max 2 rounds, then escalate).
3. Spawn `builder` with approved plan. Instruct: Phase 1 only (write tests).
4. Spawn `critic` to review tests. If BLOCK, send notes to builder (max 2 rounds, then escalate).
5. Instruct `builder` to proceed to Phase 2 (implement) and Phase 3 (verify). Phase 3 includes: fallow audit (must not be `fail`) then Chrome DevTools MCP screenshots.
6. After builder signals done, run `pnpm fallow audit --format json` yourself. If verdict is `fail`, send findings back to builder (max 1 round).
7. Spawn `reviewer` on the final diff. If BLOCK, send notes to builder (max 1 round — reviewer-blocked fixes should be small).
8. If approved: commit, push the worktree branch, run `gh pr create` with reviewer's description.
9. If any agent escalates or exceeds retry budget, stop and summarize state.
