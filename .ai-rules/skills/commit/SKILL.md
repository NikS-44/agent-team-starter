---
name: commit
description: Create commits from uncommitted work, push, and open a PR. Use when the user asks to commit and push, open a PR, or organize uncommitted changes into commits.
---

# Commit

Create commits from uncommitted work, push, and open a PR. Git-only.

---

## Git Safety Rules

- **Never** use `--no-verify`. Fix hook failures instead.
- **Never** use `git rebase -i` interactively (requires TTY input). The one exception is `GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash`, which auto-accepts the fixup reordering without opening an editor.
- **Never** invent Jira ticket IDs. Omit if unknown.
- Use `git push --force-with-lease` (not `--force`) when updating existing branches. **Always fetch before force pushing** — see the force-push recipe below.
- Use HEREDOC for commit messages to avoid shell quoting issues.
- Run `git status --short` after every operation to verify state.
- **Always use `git push -u origin <branch>`** (simple refspec) for the initial push so the local tracking ref is set up correctly. Avoid `HEAD:<branch>` refspec syntax for the first push — it skips tracking setup and causes `--force-with-lease` to fail with "stale info" on subsequent pushes.
- **Detect remote branch existence with `git ls-remote`**, not `git branch -vv`. Local tracking refs can be lost after rebase or when pushing from different worktrees. A branch can exist on the remote even when `git branch -vv` shows no tracking info. Always use `git ls-remote --heads origin <branch>` to decide between first push and force push.

**Pre-existing lint failures:** Commit hooks lint the *entire* staged file, not just your diff. When a hook fails on a lint error in lines you didn't touch:

1. Run `git diff --cached -- <file>` to confirm the flagged line is outside your changes.
2. Fix the pre-existing issue with the lightest correct approach — or add a scoped disable comment (e.g. `/* eslint-disable-next-line */`, `// eslint-disable-next-line`) with a note explaining it's pre-existing.
3. Stage the fix and retry the commit **once**. Never retry the same failed approach — read the error, fix the root cause, then commit.

**Fallow (`pnpm fallow:audit` in pre-commit / CI):** Do **not** remove rules from `.fallowrc.json` or set whole rule keys to `"off"` just to get a green hook — that drops enforcement. When a failure is a false positive or tool noise, prefer [Fallow’s own fixes](https://docs.fallow.tools/configuration/suppression): `ignoreDependencies` (e.g. CLI-only or CSS-imported packages), `ignorePatterns` when appropriate, `// fallow-ignore-next-line` / `// fallow-ignore-file` with the right [issue token](https://docs.fallow.tools/configuration/suppression#issue-type-tokens), and JSDoc `@public` (or other visibility tags) on exports that are part of the public API but not imported inside the repo. You may set a specific rule to **`"warn"`** (rule still on; audit often still exits 0) rather than `off`. If you are blocked, **stop and ask the user** before weakening project-wide rules; do not relax Fallow only to unstick a commit.

---

## Commit Principles

**Atomic:** Each commit must build and pass tests on its own.

**Coupled changes stay together:**
- Removing an export and updating all its importers = one commit.
- Changing a function signature and all callers = one commit.
- A component, its styles, and its tests = one commit.

**Order by dependency:**
- Types/interfaces before code that uses them.
- Infrastructure before features.
- Bug fixes before dependent features.

**Group by intent:**
- Feature/behavior: one specific capability or fix.
- File locality: related files (component + styles + tests).
- Generated code goes with the schema change that produced it.

**Isolate mechanical changes:**
- Whitespace, formatting, and import-order fixes go in their own commit — never mixed with logic.
- Renames and mechanical edits (find-and-replace, moves) go in their own commit.

**Temporal hygiene:**
- A commit message must only reference files, APIs, and behavior that exist *in that commit* — no forward references.
- A commit should squash when rework logically belongs in an earlier commit; the message must explain why it's separate if kept apart.

---

## Steps

1. **Analyze state:**
   ```bash
   git status --short
   git diff --stat
   git log --oneline -10
   ```

2. **Understand the net change.** Don't just look at `git diff` (HEAD to working tree). Also diff against the commit *before* the branch's changes to understand the holistic intent:
   ```bash
   git diff HEAD~1 -- <changed files>   # or use merge-base for multi-commit branches
   ```

   If uncommitted changes modify the same files as a recent commit, consider whether the user intends to amend that commit rather than create a new one. Ask if unclear.

   **Mine the conversation for context.** The diff shows *what* changed but the conversation history contains *why*: the problem that motivated the change, alternatives considered, design decisions made during planning/iteration. Extract this context — commit messages that only restate the diff are incomplete.

3. **Identify the branch.** If on a feature branch, use it. If on `master` or `main`, suggest a branch name derived from the changes using the convention `<username>/<area>-<short-summary>` (e.g., `nik/auth-token-refresh`). Infer the username prefix from existing local branches (`git branch | grep /`). Include the suggested name in the commit plan (step 4) so the user can confirm or override everything in one shot.

4. **Group changes into commits.** Apply the commit principles above. Present the plan (include the branch name when creating a new branch).

   For each commit's "Why", draw from conversation context (plans, user explanations, iteration discussions), not just the diff. The "Why" in the plan becomes the first paragraph of the commit body.

   ```
   Branch: nik/modal-component  (new)

   I've identified 2 commits:

   ### 1. components: add Modal component
   Why: Users need dismissible overlays; no reusable modal exists yet.
   Files: Modal.tsx, Modal.css, Modal.test.tsx

   ### 2. api: add rate limiting to handler
   Why: Unthrottled endpoint is vulnerable to abuse under load.
   Files: handler.ts
   Depends on: commit 1 (uses shared types introduced there)

   Ready to create branch, commits, and push?
   ```

5. **Create commits** (sequentially, one per group):

   Use hunk-level staging (`git add -p`) when a file contains changes destined for different commits. Use whole-file staging (`git add`) when the entire file belongs to one commit.

   **Write commit bodies that lead with motivation.** The first sentence of the body should explain the *problem* or *why*, not restate the title. Use the "Why" from the plan (step 4). A commit body that only describes what the diff does — without the problem it solves — is incomplete.

   ```bash
   git add path/to/file1 path/to/file2
   # or: git add -p path/to/file  (for partial staging)
   git commit -m "$(cat <<'EOF'
   <message>
   EOF
   )"
   ```

6. **Verify after each commit:**
   ```bash
   git status --short
   ```

7. **Final verification.** After all commits are created, confirm every commit has the right files and a clear message:
   ```bash
   git log --oneline
   # For each commit on the branch:
   git show --name-only <sha>
   ```

8. **Push and open PR.**

   Determine whether the branch already exists on the remote:
   ```bash
   git ls-remote --heads origin <branch>
   ```

   If the command returns **no output**, this is a first push:
   ```bash
   git push -u origin <branch>
   ```

   If the command returns **a ref**, the branch exists on the remote. **Always fetch first** to avoid the recurring "stale info" rejection. Plain `--force-with-lease` (without fetching) almost always fails after history rewrites because the local tracking ref is outdated:
   ```bash
   git fetch origin <branch>
   git push --force-with-lease=<branch>:$(git rev-parse FETCH_HEAD) origin <branch>:<branch>
   ```

   **Do not rely on `git branch -vv`** to decide between first push and force push — local tracking refs can be lost after rebase, causing `git push -u` to fail with "non-fast-forward" when the remote branch already exists.

   Check if a PR already exists:
   ```bash
   gh pr view --json url 2>/dev/null
   ```

   If no PR exists, create one with a formatted description. Use the first commit's subject as the PR title (or a combined summary if multiple commits). Write a body with `## Summary` (bullet points) and `## Test plan` (checklist) sections:
   ```bash
   gh pr create --draft --head <branch> --title "<title>" --body "$(cat <<'EOF'
   ## Summary

   - <what changed and why, one bullet per logical change>

   ## Test plan

   - [ ] <verification step>
   EOF
   )"
   ```

---

## Common Patterns

### Splitting a commit that's too large

Soft reset just that commit and its descendants, then recommit in smaller groups:
```bash
git log --oneline -10                    # find the commit before the one to split
git reset --soft <parent-of-commit>      # move HEAD back, keep changes staged
git reset HEAD                           # unstage to working dir
# recommit in smaller groups
```

### Squashing two commits together

```bash
git reset --soft HEAD~2    # squash last 2 commits into staging
git commit -m "$(cat <<'EOF'
<combined message>
EOF
)"
```

### Moving a file from one commit to another

Soft reset the range containing both commits, then recommit with the file in the right group.

---

## What to Avoid

- Commits that break the build (removing an export while importers still reference it).
- Mixing unrelated concerns in one commit.
- Mixing whitespace/formatting changes with logic changes.
- Tests separate from the code they test.
- Vague messages ("misc changes", "updates", "fix").
- Forward references in commit messages (mentioning files/APIs not yet introduced).
- "Fixup" churn that reads like an implementation diary.
- Schema changes without regenerated files.
