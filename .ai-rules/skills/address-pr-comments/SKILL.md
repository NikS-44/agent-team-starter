---
name: address-pr-comments
description: Address GitHub PR code review feedback. Use when the user wants to respond to review comments, implement reviewer feedback, or handle PR discussions. Gathers all unresolved PR comments, creates a structured TODO list, implements selected changes, and posts threaded replies.
---

You are operating inside an AI coding assistant on a local git checkout. Your job is to: (1) gather *all* GitHub PR feedback, (2) convert it into a structured TODO list, (3) ask me which items I want to address now, (4) implement the chosen changes, and (5) reply back on the *same PR comments/threads they came from* using Conventional Comments labels and review culture guidance below.

PREREQUISITES
- **Required**: `gh` CLI (GitHub CLI) — must be installed and authenticated (`gh auth status`). Used for PR detection, GraphQL queries, and posting replies.
- **Recommended**: GitHub MCP server (`mcp__github-mcp`) — provides richer structured data for PR comments and reviews. The skill tries MCP first and falls back to `gh` CLI automatically.

HARD CONSTRAINTS
- For each GitHub API operation below, both an MCP tool call and a `gh` CLI equivalent are provided. Try the MCP tool first; if unavailable or it fails, use the `gh` CLI fallback. Always use `gh` CLI for operations where no MCP equivalent exists.
- Do not post any GitHub replies until you show me the drafted replies and I confirm.
- When you do post/reply, reply to the *originating comment/thread* (inline review comment replies should be threaded replies, not a generic PR comment).
- Follow Conventional Comments labeling + response labels exactly (see "Label Guide" below).
- The PR owner (me) is accountable; optimize for delivering the feature and converging quickly.

INPUTS / DISCOVERY
1) Determine repo + PR number:
   - Detect current branch's PR: `gh pr view --json number --jq '.number'`
   - Get owner/repo: `gh repo view --json nameWithOwner --jq '.nameWithOwner'`
   - Detect base branch: `gh pr view --json baseRefName --jq '.baseRefName'` (store as `{base_branch}` — used later for rebase/log commands)
   - If you can't detect PR number, ask me for it (single question). After obtaining the PR number, re-run both owner/repo and base branch detection using the explicit PR number: `gh pr view {pr_number} --json baseRefName --jq '.baseRefName'`. Then proceed.

DATA COLLECTION (MUST BE COMPLETE — UNRESOLVED ONLY)
Collect and normalize all feedback into a single list with stable IDs.
**IMPORTANT: Only include UNRESOLVED comments. Filter out resolved threads.**

A) PR-level conversation comments (issue comments on PR):
   - **MCP**: `mcp__github-mcp__pull_request_read` with method `get_comments`, paginating with `page` and `perPage` as needed.
   - **gh fallback**: `gh api repos/{owner}/{repo}/issues/{pr_number}/comments --paginate`
   - These are generally unresolved unless explicitly marked.

B) Review comments (inline) across all review threads — UNRESOLVED ONLY:
   - **MCP**: `mcp__github-mcp__pull_request_read` with method `get_review_comments`, paginating with `perPage` and `after` cursor as needed. This returns threads with `isResolved`, `isOutdated`, and `isCollapsed` metadata.
   - **gh fallback**: GraphQL query (paginate if `hasNextPage` is true by passing the `endCursor` as `$threadCursor` / `$commentCursor` on subsequent requests):
   ```
   gh api graphql -f query='
     query($owner: String!, $repo: String!, $pr: Int!, $threadCursor: String) {
       repository(owner: $owner, name: $repo) {
         pullRequest(number: $pr) {
           reviewThreads(first: 100, after: $threadCursor) {
             pageInfo { hasNextPage endCursor }
             nodes {
               isResolved
               isOutdated
               comments(first: 50) {
                 pageInfo { hasNextPage endCursor }
                 nodes {
                   databaseId
                   author { login }
                   createdAt
                   body
                   path
                   line
                   diffHunk
                   replyTo { databaseId }
                   url
                 }
               }
             }
           }
         }
       }
     }
   ' -f owner="{owner}" -f repo="{repo}" -F pr={pr_number}
   ```
   - **EXCLUDE** any thread where `isResolved: true`
   - Mark threads where `isOutdated: true` as low-priority (code has changed since comment)

C) Review summaries (top-level review bodies; sometimes contain actionable items):
   - **MCP**: `mcp__github-mcp__pull_request_read` with method `get_reviews`, paginating as needed.
   - **gh fallback**: `gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews --paginate`
   - Only include reviews with state "CHANGES_REQUESTED" or "COMMENTED" that haven't been superseded by an "APPROVED" review from the same author.

For each item, extract:
- source_type: issue_comment | review_comment | review_body
- id (GitHub comment/review id — for review_comment, always store the numeric `databaseId` for use in REST API calls; the GraphQL node `id` is not accepted by REST endpoints)
- author.login
- created_at
- body (raw markdown)
- For review_comment: path, line, diffHunk, replyTo.databaseId (if any), isOutdated
- url / html_url
- resolution_status: unresolved | outdated (never include resolved)

DE-DUPING / FILTERING
- Do NOT automatically ignore comments authored by me (the PR owner).
- For PR-owner-authored comments, infer intent and handle accordingly:
  1) Actionable (INCLUDE as normal todo item):
     - expresses a change request / self-TODO / decision to revise.
     - indicators: "TODO", "follow up", "before merge", "blocker", "must", "need to", "should", "let's", "I'll update", "I will refactor", "fix this", "add test", "remove", "rename", "simplify", "this is hacky/temporary/revisit".
  2) Context-only (EXCLUDE from todo list; keep as reference):
     - informational/status for other reviewers.
     - indicators: "FYI", "context:", "note:", "pushing fix", "rebased", "addressed in latest commit", "PTAL", "see Slack/JIRA for context", "out of scope", "tracked in JIRA-...".
  3) Meta/coordination (EXCLUDE from todo list; surface in a Meta section if it impacts next steps):
     - e.g., "let's hop on Zoom", "waiting on X", "will resolve offline".
- Ignore bot comments unless they clearly indicate required changes.
- Treat multiple comments in the same thread separately unless they're clearly a single request; prefer grouping by (path + line + author + topic).

**EXCLUDE NON-ACTIONABLE COMMENTS ENTIRELY:**
- praise / thanks / LGTM / "nice" / "looks good" / compliments — skip these entirely
- flyby: comments that are just observations with no request
- Comments that are purely acknowledgments or agreements
- Only include comments that request a specific change, ask a question that needs answering, or identify a problem that needs fixing

CRITICAL EVALUATION (DO NOT BLINDLY ACCEPT ALL FEEDBACK)
Before adding any comment to the TODO list, critically evaluate whether the feedback is:

1) **Technically correct**: Does the reviewer's suggestion actually improve the code?
   - Check if the suggestion introduces bugs, breaks existing behavior, or misunderstands the code
   - Verify claims about performance, security, or best practices are accurate
   - If the reviewer misread the code or made an incorrect assumption, note this

2) **Contextually appropriate**: Does the reviewer have full context?
   - Consider if the reviewer might be missing context about requirements, constraints, or prior decisions
   - Check if there's a good reason for the current implementation they may not see

3) **Worth the tradeoff**: Is the change worth making?
   - For style/preference comments, consider if the change adds real value
   - For refactoring suggestions, weigh the risk/effort against the benefit
   - Exception: DB efficiency, error handling, and transaction correctness improvements should default to "address"
   - Consider if the suggestion expands scope unnecessarily

4) **Within PR scope**: Does addressing this belong in this PR?
   - Flag suggestions that should be separate follow-up work
   - Don't let scope creep derail the PR

5) **Backend correctness and efficiency**: Default to ADDRESSING these categories:
   - Redundant database reads/writes (e.g., duplicate fetches of the same record)
   - Missing or insufficient transaction usage
   - Silently discarded errors (especially in DB/RPC calls)
   - N+1 query patterns or unnecessary round-trips
   - Missing error logging on failure paths
   These are not scope creep — they are part of shipping correct, production-quality code.
   Only decline if the fix would require a large, risky refactor of unrelated code.

For each TODO item, include your assessment:
- **validity**: valid | questionable | incorrect
- **recommendation**: address | discuss | decline
- **reasoning**: Brief explanation of your evaluation

If you assess a comment as questionable or incorrect, explain why and propose either:
- A counter-argument to discuss with the reviewer
- A modified approach that addresses their underlying concern
- A justification for declining the suggestion

CLASSIFICATION + LABELING (Conventional Comments)
For each feedback item, infer a Conventional Comments label if the reviewer didn't provide one.
Use these primary labels:
- nitpick: (trivial preference; non-blocking)
- suggestion: (improvement; explain why)
- issue: (problem/bug/maintainability/perf/security; ideally include suggestion)
- question: (clarification/investigation)
Optional expressive labels if appropriate:
- todo:, thought:, chore:, flyby:, quibble:
If the commenter already used a label prefix, preserve it.

For each item, also propose the appropriate response label we'll use when replying:
- For nitpick/suggestion/thought/quibble: usually "fixed:" or "considered:"
- For nitpick/todo/chore: usually "fixed:" or "justification:" (if not doing)
- For issue/todo/chore: usually "fixed:"
- For question: "answer:" (and "fixed:" if you changed code)
- For praise/flyby/LGTM: DO NOT REPLY — excluded from processing entirely

OUTPUT 1 — TODO LIST (ASK ME WHAT TO DO)
Present a checklist grouped by severity/urgency:
1) Blocking-ish (issue/chore/todo)
2) Quality improvements (suggestion)
3) Style nits (nitpick/quibble)
4) Questions requiring answers
5) Meta/coordination notes (if any)

**NOTE: Do NOT include praise, thanks, LGTM, or other non-actionable comments.**

For each entry show:
- [ ] item_key (short stable key like RC-12, IC-3, RV-2)
- label (e.g., issue:)
- short summary (1 line)
- location (file:line if review_comment)
- author
- link
- **validity**: valid | questionable | incorrect
- **recommendation**: address | discuss | decline
- **reasoning**: Why you assessed it this way (1-2 sentences)
- your proposed action (what code change, OR why to decline/discuss)
- your proposed reply text (draft) with response label (fixed:/considered:/justification:/answer:)

For items marked "questionable" or "incorrect", clearly explain:
- What the reviewer got wrong or may have missed
- Your recommended response (pushback, clarification, or alternative approach)

Then ask me: "Which item_keys should I address now?" and wait for my selection.
(Do not ask any other questions unless absolutely required to proceed.)

IMPLEMENTATION PHASE (ONLY FOR SELECTED ITEMS)
For each selected item:
1) Make the smallest reasonable change to address the feedback while preserving PR scope.
2) Prefer clear, maintainable code; avoid unrelated refactors.
3) Update tests where relevant; run the most relevant local checks (unit tests / lint) available in the repo (infer from package manager / tooling; if unclear, run the fastest standard checks).
4) Keep changes logically grouped; DO NOT commit yet — leave changes unstaged.
5) Maintain delivery focus: we're partners with reviewers; respond clearly and concisely.

FIXUP + REBASE PHASE (AFTER IMPLEMENTATION)
After all selected items are implemented:
1) Create fixup commits for each change, targeting the appropriate original commit:
   - Match changes to commits by CONTENT, INTENT, and CONTEXT (not just file).
   - Use `git commit --fixup=<commit-sha>` for each logical group.
   - If a file has changes belonging to different commits, split via partial patches:
     1. `git diff path/to/file > /tmp/full.patch`
     2. Edit `/tmp/full.patch` to keep only the hunks for the target commit
     3. `git apply --cached /tmp/full.patch` to stage just those hunks
     4. Repeat for remaining hunks targeting other commits
   - For changes that don't belong to any existing commit, create a new commit with `new:` prefix.
2) State confidence level for each fixup (HIGH/MEDIUM/LOW).
3) Verify fixup targets: `git log --oneline origin/{base_branch}..HEAD`
4) Run interactive rebase with autosquash:
   `GIT_EDITOR=true GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash $(git merge-base HEAD origin/{base_branch})`
5) If conflicts occur, pause and ask for guidance.
6) After successful rebase, show me the final commit log (`git log --oneline origin/{base_branch}..HEAD`) and ask for confirmation before pushing. (Skip this confirmation if the user said to auto-push at any point in the conversation.)
7) Push to origin (always specify branch explicitly):
   `git push -f origin $(git rev-parse --abbrev-ref HEAD)`

OUTPUT 2 — CHANGE SUMMARY + DRAFT REPLIES (AFTER PUSH, BEFORE POSTING REPLIES)
After the fixup+rebase+push phase completes successfully, produce:
- A brief summary of code changes per item_key (include files touched).
- Any tradeoffs / why a comment was considered but not changed.
- Draft reply for each item_key, using the proper response label and referencing what changed (and where). Keep it crisp.

IMPORTANT: Replies must include just enough context. **Bold the response label** (including colon) in GitHub markdown:
- "**Fixed:** updated X to Y (file:line)."
- "**Considered:** keeping X because ..."
- "**Reasoning:** ..."
- "**Answer:** ..."

REPLYING RULE
- Do not post threaded replies to my own comments unless there is a clear benefit for reviewers.
- If an actionable self-comment was addressed, prefer either:
  - no reply, or
  - a single PR-level summary comment referencing the item_key and what changed.

POSTING REPLIES (ONLY AFTER I CONFIRM)
When I confirm, post replies using the appropriate method:

- For inline PR review comments (review_comment) — threaded reply:
  - **MCP**: `mcp__github-mcp__add_reply_to_pull_request_comment` (use if available)
  - **gh fallback**:
    ```
    gh api -X POST repos/{owner}/{repo}/pulls/{pr_number}/comments/{databaseId}/replies -f body="$(cat <<'EOF'
    {reply_markdown}
    EOF
    )"
    ```

- For PR conversation issue comments (issue_comment):
  - **MCP**: `mcp__github-mcp__add_issue_comment` with `issue_number` set to the PR number.
  - **gh fallback**:
    ```
    gh api -X POST repos/{owner}/{repo}/issues/{pr_number}/comments -f body="$(cat <<'EOF'
    {reply_markdown}
    EOF
    )"
    ```
  - Quote + link back to the original comment in the body.

- For review bodies (review_body):
  - **MCP**: `mcp__github-mcp__add_issue_comment` with `issue_number` set to the PR number.
  - **gh fallback**:
    ```
    gh api -X POST repos/{owner}/{repo}/issues/{pr_number}/comments -f body="$(cat <<'EOF'
    {reply_markdown}
    EOF
    )"
    ```
  - Reference the review URL and summarize what changed.

In reply_markdown, follow Conventional Comments format with **bolded response labels** (use double asterisks):
- "**fixed:** ..."
- "**considered:** ..."
- "**justification:** ..."
- "**answer:** ..."

LABEL GUIDE (MUST FOLLOW)
Primary labels: nitpick:, suggestion:, issue:, question:
Response labels: fixed:, considered:, justification:, answer:
Optional (for classification only): todo:, thought:, chore:, flyby:, quibble:
Non-actionable (SKIP ENTIRELY — no TODO, no reply): praise:, thanks:, LGTM

CULTURE / PROCESS PRINCIPLES
- The goal is delivery of the feature; reviewer + author are equal partners.
- I'm accountable for outcome; keep PR well-structured; don't expand scope.
- Aim for quick iteration and clarity; propose Zoom/live review if thrash emerges (>2 iterations or complex review), but don't schedule it automatically.

NOW DO IT
Start by detecting the PR and gathering comments as specified. Then produce OUTPUT 1 (the TODO checklist + your drafted replies) and ask me which item_keys to address.
