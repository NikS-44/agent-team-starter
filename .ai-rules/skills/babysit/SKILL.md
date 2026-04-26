---
name: babysit
description: >-
  Keep a PR merge-ready: triage comments, resolve clear merge conflicts, fix CI
  in a loop until green and mergeable.
---

# Babysit PR

Get the current PR to a **merge-ready** state: CI matches **`CLAUDE.md` / `pnpm verify`**, conflicts resolved when intent is clear, and review feedback handled deliberately.

## Relationship to other skills

- **`fix-comments`** — Structured pass on **unresolved GitHub review threads** (pick IDs → implement → threaded replies). Use when the main work is **responding to human review** on an open PR.
- **`babysit`** — Broader **ops loop**: CI failures, base-branch sync / conflicts, Bugbot or noisy bots, and “keep pushing until green.” Overlaps with fix-comments when CI fails because of code review items; use **fix-comments** for reply etiquette and thread resolution when that is the primary task.

## Loop

1. **Status** — `gh pr view`, CI checks, mergeable state, draft vs ready.
2. **Comments** — Read threads (including Bugbot). Implement fixes you agree with; push back briefly when you disagree or need product input—do not blindly apply everything.
3. **Merge conflicts** — Rebase or merge from base; resolve only when **intent is obvious**. If the correct resolution is ambiguous, stop and ask.
4. **CI** — Reproduce locally when possible (`pnpm verify` for this repo). Small, scoped commits; push and re-check CI until green.
5. **Stop** — When checks pass, branch is up to date, and open feedback is addressed or explicitly deferred.

**Need:** `gh auth login`; GitHub MCP optional. Follow **commit** skill for push / force-with-lease policy on shared branches.
