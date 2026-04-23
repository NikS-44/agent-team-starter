---
description: Run the full plan→test→build→review pipeline
---
Feature spec: $ARGUMENTS

You are the Lead. Execute this pipeline:

**Branch (kickoff):** Before step 1, if the worktree is on a feature branch, check whether that work is **already merged** (e.g. `gh pr list --head "$(git branch --show-current)" --state merged` is non-empty, or the user said the old PR is merged and this is new work). If the branch’s PR is **MERGED** (or the user is starting a new topic after a merge), do not run the pipeline on that branch. Run `git fetch origin`, `git switch main` (or the repo default), align with the remote (`git pull` or, if local `main` lags and has nothing to keep, `git reset --hard origin/main`), then `git switch -c <user>/<new-topic>`. If there is an **open, unmerged** PR and the spec continues the same work, keep that branch. When in doubt, a new branch from updated default. **Do not** open a new PR for separate work on a branch whose previous PR is already merged.

**UI / route + Chrome MCP (conditional):** For production UI or routing changes (see **CLAUDE.md**), run **chrome-devtools-verify** **when Chrome DevTools MCP is working**. If MCP is not available, document that in **Verification** and continue — not a hard blocker. **`reviewer`** may **note** missing browser evidence when MCP was likely available but should not **BLOCK** solely for that.

1. Spawn `architect` with the spec. Await plan.
2. Spawn `critic` to review plan. If BLOCK, loop to step 1 with critic's notes (max 2 rounds, then escalate).
3. Spawn `builder` with approved plan. Instruct: Phase 1 only (write tests).
4. Spawn `critic` to review tests. If BLOCK, send notes to builder (max 2 rounds, then escalate).
5. Instruct `builder` to proceed to Phase 2 (implement) and Phase 3 (verify). Phase 3 includes: fallow audit (must not be `fail`); **Chrome DevTools MCP** (full **chrome-devtools-verify** checklist) **when MCP is working** and the change touches UI/routes; **drizzle-db-verify** when `db/`, `server/`, or migrations change. When browser verification runs, save **`take_screenshot`** with **`filePath`** under **`verification/<branch-or-ticket>/`** for step 6 and **`scripts/pr-comment-verify-gist.sh`** (step 9). If UI changed but MCP cannot run, builder notes that and still completes Phase 3 on fallow + tests.
6. **Verification report (required):** After builder signals Phase 3, the Lead should run or confirm **chrome-devtools-verify** **when MCP is working** and UI/routes changed. The Lead must:
   - Confirm `/ship-report` was opened when nav, routes, or ship workflow are in scope (if using browser MCP).
   - When MCP was used: screenshots under `verification/<branch-or-ticket>/` for **happy path** and **error/empty** where applicable, plus feature URLs from the spec.
   - Paste the **PR blurb template** from `/ship-report` (or equivalent) into the handoff. **If MCP was unavailable:** state that under **Verification** — automated tests still count. On-disk paths under `verification/…` feed step 9’s gist script.
7. After builder signals done, run `pnpm fallow audit --format json` yourself. If verdict is `fail`, send findings back to builder (max 1 round).
8. Spawn `reviewer` on the final diff. If BLOCK, send notes to builder (max 1 round — reviewer-blocked fixes should be small).
9. If approved: commit, push the worktree branch, then open a PR or reuse an **open, unmerged** one:
   - **`gh pr create`** with the reviewer’s description **including the verification report** and the **local** screenshot paths under `verification/…` (for traceability). Or, if the current branch still has an **open** PR, use **`gh pr view --json number`** for `<PR_NUMBER>`. If the previous PR for this line of work is **merged** and the spec is new, you should already be on a new branch (see **Branch (kickoff)**) — use **`gh pr create`**; do not attach new commits to a merged PR.
   - **Inline images on the PR (no binary commits):** When the change touched **UI or routes** and there are **image files on disk** from verification (typically under `verification/<branch-or-ticket>/`), run from the repo root—**once**, with **all** images in a single invocation so one comment holds the full set:
     ```bash
     scripts/pr-comment-verify-gist.sh <PR_NUMBER> path/to/first.png [path/to/second.png ...]
     ```
     Requires **`gh` authenticated** (`gh auth login`). Default gist is **secret (unlisted)**; set **`VERIFY_GIST_PUBLIC=1`** only if you need a **public** gist. **Do not** `git add` those verification images unless the user explicitly wants them in the repo. Details and manual fallback: **chrome-devtools-verify** skill (“PR thread only — gist + `gh`”).
   - If there are **no** screenshots on disk, **skip** the gist script; **Verification** should still describe what ran (browser MCP or tests only). For **backend-only** changes, skip the gist script.
10. If any agent escalates or exceeds retry budget, stop and summarize state.
