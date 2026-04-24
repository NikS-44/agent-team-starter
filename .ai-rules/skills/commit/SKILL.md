---
name: commit
description: Create commits, push, open PR. Git-only.
---

## Safety (read first)

- No `--no-verify` — fix hooks.
- No interactive `git rebase -i` except `GIT_SEQUENCE_EDITOR=true … --autosquash` when automated.
- No fake ticket IDs. HEREDOC for commit bodies. `git status -s` after each step.
- First push: `git push -u origin <branch>`. **Remote exists?** `git ls-remote --heads origin <branch>`, not only `git branch -vv` (tracking can be wrong). After rebase: `git fetch` then `git push --force-with-lease=…` per team policy; **fetch** before force-with-lease to avoid stale rejection.
- Hooks lint **staged file whole file** — if the error is in untouched lines, fix minimally or one scoped disable with “pre-existing” note, one retry. **Fallow:** do not nuke `.fallowrc.json` — use [official suppressions](https://docs.fallow.tools/configuration/suppression) or `// fallow-ignore-*` / `@public` as appropriate.

## Principles (short)

- One commit = one buildable story. Coupled edits together (export + all imports, signature + all callers, component + styles + tests). Mechanical/format-only in its own commit. Message body: **why**, not only what.

## Flow

1. `git status -s` · `git diff --stat` · `git log -10` — understand WIP. Compare to merge-base if a long branch.
2. If `main` and new work, branch `git switch -c <user>/<area>-<slug>` (infer prefix from `git branch` names with `/`).
3. **Group** into commits (list plan: title, why, files per commit; ask if unclear).
4. `git add` / `git add -p` → `git commit` with heredoc message.
5. After all commits: `git log --oneline`, spot-check `git show --name-only` per commit.
6. **Push:** `git ls-remote --heads origin <branch>` empty → `git push -u origin <branch>`. Else `git fetch origin <branch>` then force-with-lease as needed. **PR:** `gh pr view` or `gh pr create` with `## Summary` + `## Test plan`.

## Common

- **Split** last bad commit: `git reset --soft HEAD~1`, unstage, recommit in chunks.
- **Squash** last N: `git reset --soft HEAD~N` then one new commit.
- **Fixup rebase:** `git commit --fixup` … `GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash <merge-base>` (details in **fix-comments** / team docs).

## Avoid

Broken intermediate commits, unrelated mixes, vague “fix/update” messages, schema changes without generated artifacts, code without its tests in the same logical commit when they belong together.
