---
name: absorb
description: >-
  Fold uncommitted work into the right existing commits (fixup, amend, or soft-reset
  and split). See **commit** skill for full git safety; same hook / force-push rules apply.
---

# Absorb

1. `git status -s` · `git log -10` · `merge-base` = `git merge-base HEAD origin/main` (or your default). See holistic diff: `git diff <merge-base>`.
2. **Map** each changed hunk to the commit that “owns” that concern.
3. **Pick the lightest fix:**
   - **A — Amend HEAD** — everything belongs in last commit: `git add … && git commit --amend --no-edit`
   - **B — Fixup** — one older commit: `git commit --fixup=<sha>` then `GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash <merge-base>`
   - **C — Soft reset** — boundaries are wrong: `git add -A && git reset --soft <merge-base> && git reset HEAD` to flatten to working tree, then **rebuild commits** (same atomic rules as **commit**).
4. **Push:** `git fetch` + `git push -u` or `--force-with-lease` per **commit** skill.

**Follow-up fixes (CI, review) after a prior push** are the same as absorb: fold with A/B/C, then push.

**Split / squash** — same as **commit** (soft reset a range, recommit). Avoid mixing unrelated work; avoid vague messages.
