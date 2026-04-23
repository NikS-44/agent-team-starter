---
name: absorb
description: Fold uncommitted changes into the right existing commits. Use when the user asks to absorb changes, fold fixes into commits, or wants to clean up dirty working tree against an existing commit history.
---

# Absorb

Fold uncommitted changes into the right existing commits. Git-only.

---

## Git Safety Rules

- **Never** use `--no-verify`. Fix hook failures instead.
- **Never** use `git rebase -i` interactively (requires TTY input). The one exception is `GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash`, which auto-accepts reordering without opening an editor.
- **Never** invent Jira ticket IDs. Omit if unknown.
- Use `git push --force-with-lease` (not `--force`) when updating existing branches. **Always fetch before force pushing** — see the force-push recipe below.
- Use HEREDOC for commit messages to avoid shell quoting issues.
- Run `git status --short` after every operation to verify state.
- **Always use `git push -u origin <branch>`** (simple refspec) for the initial push so the local tracking ref is set up correctly.
- **Detect remote branch existence with `git ls-remote`**, not `git branch -vv`. Always use `git ls-remote --heads origin <branch>` to decide between first push and force push.

**Pre-existing lint failures:** Commit hooks lint the *entire* staged file, not just your diff. When a hook fails on a lint error in lines you didn't touch:
1. Run `git diff --cached -- <file>` to confirm the flagged line is outside your changes.
2. Fix the pre-existing issue with the lightest correct approach.
3. Stage the fix and retry the commit **once**. Never retry the same failed approach — read the error, fix the root cause, then commit.

---

## Commit Principles

**Atomic:** Each commit must build and pass tests on its own.

**Coupled changes stay together:**
- Removing an export and updating all its importers = one commit.
- Changing a function signature and all callers = one commit.
- A component, its styles, and its tests = one commit.

**Group by intent:**
- Feature/behavior: one specific capability or fix.
- File locality: related files (component + styles + tests).
- Generated code goes with the schema change that produced it.

**Isolate mechanical changes:**
- Whitespace, formatting, and import-order fixes go in their own commit — never mixed with logic.

---

## Commit Message Format

- Start with an imperative verb (add, fix, remove, update, refactor, etc.)
- Subject line: 50 chars or fewer, no trailing period.
- No body unless the why is non-obvious. Never reference ticket IDs you're not certain of.

---

## Steps

1. **Analyze state:**
   ```bash
   git status --short
   git diff --stat
   git log --oneline -10
   ```

2. **Identify the base.** Find where the branch diverges from the remote default branch:
   ```bash
   git merge-base HEAD origin/master
   ```
   Count commits on the branch: `git log --oneline <merge-base>..HEAD`

3. **Understand the net change.** Diff working tree against the merge-base to see the holistic intent, not just the incremental diff from HEAD:
   ```bash
   git diff <merge-base> -- <changed files>
   ```

4. **For each changed file,** determine which existing commit it belongs to (the commit that originally introduced or last meaningfully changed that file).

5. **Choose the lightest strategy that fits.** Pick from the three approaches below, in order of preference:

### Strategy A: Amend HEAD

Use when **all** uncommitted changes belong to the most recent commit.

```bash
git add <files>
git commit --amend --no-edit
```

Lowest risk — no rebase, no restaging of other commits.

### Strategy B: Fixup + autosquash

Use when changes target **one specific non-HEAD commit** and the branch has no overlapping edits that would cause rebase conflicts.

```bash
# Find the target commit SHA
git log --oneline <merge-base>..HEAD

# Create a fixup commit targeting that SHA
git add <files>
git commit --fixup=<target-sha>

# Autosquash rebase (non-interactive — GIT_SEQUENCE_EDITOR=true skips the editor)
GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash <merge-base>
```

Only the target commit is rewritten; others are replayed on top. Low risk when there's no overlap between commits.

### Strategy C: Soft reset and recommit

Use when changes **span multiple existing commits**, commit boundaries need to change, or the simpler strategies don't apply.

```bash
git add .                        # stage uncommitted work
git reset --soft <merge-base>    # squash all branch commits into staging
git reset HEAD                   # unstage everything to working dir
```

Now all changes (old commits + new work) are in the working directory. Recommit in groups, applying the same commit principles. Highest risk — use only when necessary.

6. **Push and update PR.**

   Determine whether the branch already exists on the remote:
   ```bash
   git ls-remote --heads origin <branch>
   ```

   If **no output**, this is a first push:
   ```bash
   git push -u origin <branch>
   ```

   If **a ref is returned**, the branch exists — fetch then force push:
   ```bash
   git fetch origin <branch>
   git push --force-with-lease=<branch>:$(git rev-parse FETCH_HEAD) origin <branch>:<branch>
   ```

---

## Continuation: Iterative Development Loops

After a previous commit session creates commits and pushes, a common pattern is: CI fails → user fixes code → changes need to be folded back in.

**If you already completed a commit session and the user makes follow-up changes (e.g., fixing a CI failure, addressing a review comment), treat new uncommitted changes as an implicit absorb.** You do not need the user to re-invoke absorb explicitly. Analyze the dirty files, match them to existing commits, and fold them in using the lightest strategy (amend HEAD, fixup+autosquash, or soft-reset).

After absorbing, push the updated branch using the force-push recipe above.

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
- "Fixup" churn that reads like an implementation diary.
- Schema changes without regenerated files.
