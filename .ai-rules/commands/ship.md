---
description: Run the full plan→test→build→review pipeline
---
Feature spec: $ARGUMENTS

You are the Lead. Execute this pipeline:

1. Spawn `architect` with the spec. Await plan.
2. Spawn `critic` to review plan. If BLOCK, loop to step 1 with critic's notes (max 2 rounds, then escalate).
3. Spawn `builder` with approved plan. Instruct: Phase 1 only (write tests).
4. Spawn `critic` to review tests. If BLOCK, send notes to builder (max 2 rounds, then escalate).
5. Instruct `builder` to proceed to Phase 2 (implement) and Phase 3 (verify). Phase 3 includes: fallow audit (must not be `fail`); then **Chrome DevTools MCP** for UI/route work and **drizzle-db-verify** (live `/api/...` smoke) when `db/`, `server/`, or migrations change. For Chrome verification, builder must save **`take_screenshot`** output with **`filePath`** under **`verification/<branch-or-ticket>/`** so the Lead can run **`scripts/pr-comment-verify-gist.sh`** after `gh pr create` (see step 9).
6. **Verification report (required):** After builder signals Phase 3 browser checks, the Lead must:
   - Confirm `/ship-report` was opened in the running app (proves shell + routing for the ship workflow when nav or routes changed).
   - Confirm screenshots exist under `verification/<branch-or-ticket>/` (or equivalent) for **happy path** and **error/empty** where applicable, plus any **feature URLs** from the spec.
   - Paste the **PR blurb template** from `/ship-report` (or a markdown summary with the same sections: Summary, Routes/URLs, Verification, Fallow) into the handoff. If Chrome DevTools MCP was unavailable, state that explicitly and list what was verified another way; do not silently skip the report. On-disk paths under `verification/…` are what step 9 uses for the gist PR comment—do not rely on unwritten temp paths.
7. After builder signals done, run `pnpm fallow audit --format json` yourself. If verdict is `fail`, send findings back to builder (max 1 round).
8. Spawn `reviewer` on the final diff. If BLOCK, send notes to builder (max 1 round — reviewer-blocked fixes should be small).
9. If approved: commit, push the worktree branch, then open or reuse a PR:
   - **`gh pr create`** with the reviewer’s description **including the verification report** and the **local** screenshot paths under `verification/…` (for traceability). Or, if the branch already has a PR, use **`gh pr view --json number`** for `<PR_NUMBER>`.
   - **Inline images on the PR (no binary commits):** When the change touched **UI or routes** and there are **image files on disk** from verification (typically under `verification/<branch-or-ticket>/`), run from the repo root—**once**, with **all** images in a single invocation so one comment holds the full set:
     ```bash
     scripts/pr-comment-verify-gist.sh <PR_NUMBER> path/to/first.png [path/to/second.png ...]
     ```
     Requires **`gh` authenticated** (`gh auth login`). Default gist is **secret (unlisted)**; set **`VERIFY_GIST_PUBLIC=1`** only if you need a **public** gist. **Do not** `git add` those verification images unless the user explicitly wants them in the repo. Details and manual fallback: **chrome-devtools-verify** skill (“PR thread only — gist + `gh`”).
   - If there are **no** screenshot files on disk (MCP unavailable, backend-only change, etc.), **skip** the script; the PR body’s verification section is enough.
10. If any agent escalates or exceeds retry budget, stop and summarize state.
