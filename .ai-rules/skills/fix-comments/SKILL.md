---
name: fix-comments
description: >-
  Address GitHub PR review: gather unresolved feedback, TODO list, implement selected
  items, thread replies. Requires GitHub CLI (`gh`).
---

# Fix PR comments

**Need:** `gh` installed and `gh auth login`. **Prefer `gh`** for every GitHub operation (`gh pr`, `gh api`, GraphQL via `gh api graphql`). Use GitHub MCP only when `gh` cannot do the job.

**Rules:** Threaded replies to the **original** thread. **Conventional Comments** + response labels (below). **Do not** post to GitHub until the user approves draft replies. Praise/LGTM/non-actionable → skip (no TODO, no reply).

## 1) Find PR and collect **unresolved** only

- PR: `gh pr view --json number` or ask once for number. Owner/repo: `gh repo view --json nameWithOwner`. Base: `gh pr view <n> --json baseRefName`.
- Sources: (a) issue comments on the PR, (b) review threads (`isResolved: false` only), (c) review bodies worth acting on. Collect via **`gh api`** / `gh api graphql` (see Reference) — **exclude** `isResolved: true` and **praise / thanks / LGTM** with no request.
- De-dupe; flag `isOutdated` as low priority.

**Per item store:** `source_type` (issue / inline / review), stable `id` (REST `databaseId` for inline), `body`, `path:line` if any, `author`, `url`, `isOutdated`.

**Filter:** “Actionable” = asks for a change, asks a question that needs an answer, or flags a real problem. “Context-only” (FYI, already fixed, out of scope ticket) → optional Meta section, not the main TODO. Owner self-comments: treat as normal if they request work.

**Critical pass** (brief): technical validity, in-scope, worth the tradeoff. For each item: `validity` (valid / questionable / incorrect), `recommendation` (address / discuss / decline), one-line **reasoning**. DB correctness / N+1 / silent errors → default **address** unless huge scope.

## 2) Conventional Comments (classification)

**Primary:** `nitpick:`, `suggestion:`, `issue:`, `question:` (plus optional `todo:`, `thought:`, `chore:`, `flyby:`, `quibble:` as needed). Preserve labels if the author used them.

**Replies (bold in GitHub):** `**Fixed:**` `**Considered:**` `**Justification:**` `**Answer:**` — match to issue type (e.g. question → **Answer:**).

**Skip with no entry:** pure praise, flyby with no ask.

## 3) OUTPUT 1 — TODO (before coding)

Group by urgency: blockers / issues → suggestions → nits → questions.

Each line: ` [ ] id` (e.g. RC-1), **label**, one-line summary, file:line, author, link, validity, recommendation, proposed action, **draft reply** with response label.

Ask: **“Which ids should I implement?”** and wait. Then implement **only** selected items.

## 4) Implement (selected only)

- Smallest change; same PR scope. Update tests; run fast local checks (tests/lint) per repo. **Do not** commit until fixup phase unless user says so.

## 5) Fixup + rebase (if stacking fixups on existing commits)

- `git commit --fixup=<sha>` per logical group; complex splits: partial stage per hunk.  
- `GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash $(git merge-base HEAD origin/<base>)`  
- Conflicts → stop and ask. After rebase, show `git log` and get OK before `git push -f` with care (**force-with-lease** on shared branches if policy allows; commit skill has safety details).

## 6) OUTPUT 2 — after push, before posting

- Short summary per id; draft threaded replies (bold labels). **Do not post** until user confirms.

## 7) Post (after user confirms)

- **Inline (threaded reply to a review comment):** **`gh api`** using the REST path that includes the **PR number**:
  ```bash
  gh api -X POST repos/{owner}/{repo}/pulls/{pr_number}/comments/{comment_id}/replies -f body='...'
  ```
  Use the PR you are on (`gh pr view --json number`) for `{pr_number}`. For `{comment_id}`, use the thread’s REST id — same value as GraphQL `databaseId` (or `gh api repos/{owner}/{repo}/pulls/{pr_number}/comments --jq '.[].id'`).
  **404 trap:** `repos/{owner}/{repo}/pulls/comments/{comment_id}/replies` **omits** `{pr_number}` and is **not** a valid endpoint; GitHub returns Not Found.
- **Issue comment (PR conversation):** `gh pr comment` or `gh api -X POST repos/{owner}/{repo}/issues/{pr_number}/comments -f body='...'`.

Reply text: one tight paragraph; link what changed. Don’t thread-reply to your own comments unless it helps reviewers.

## Reference: GraphQL (only if you need full thread pagination)

`gh api graphql` with `reviewThreads` / `isResolved` — paginate with `endCursor` until done. Many tasks only need `gh pr view` + review UI links; use the minimal API that returns unresolved threads.

---

**Principles:** Ship the feature; keep scope; iterate quickly; escalate if review thrash > 2 rounds.

**NOW:** Detect PR → OUTPUT 1 → wait for id selection.
