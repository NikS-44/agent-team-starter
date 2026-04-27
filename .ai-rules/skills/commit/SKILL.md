---
name: commit
description: Create commits, push, open PR. Git-only.
---

**GitHub:** Prefer **`gh`** for PRs and GitHub API calls. Do not reach for GitHub MCP when `gh pr` / `gh api` suffices.

## Safety (read first)

- **Never push to `main` directly.** If the current branch is `main`, stop and branch first: `git switch -c <user>/<slug>`. Push only feature branches; `main` is updated via merged PRs only.
- **Merged PR / branch:** Do not add commits on a branch whose PR is already merged. The pre-commit hook (`scripts/precommit-merged-pr-guard.sh`) blocks that (via `gh` when available). Create a new branch from `main`: `git fetch origin && git switch -c <user>/<topic> origin/main`. One-off bypass: `SKIP_MERGED_BRANCH_GUARD=1 git commit` (avoid for normal work).
- No `--no-verify` — fix hooks.
- No interactive `git rebase -i` except `GIT_SEQUENCE_EDITOR=true … --autosquash` when automated.
- No fake ticket IDs. HEREDOC for commit bodies. `git status -s` after each step.
- First push: `git push -u origin <branch>`. **Remote exists?** `git ls-remote --heads origin <branch>`, not only `git branch -vv` (tracking can be wrong). After rebase: `git fetch` then `git push --force-with-lease=…` per team policy; **fetch** before force-with-lease to avoid stale rejection.
- Hooks lint **staged file whole file** — if the error is in untouched lines, fix minimally or one scoped disable with “pre-existing” note, one retry. **Fallow:** do not nuke `.fallowrc.json` — use [official suppressions](https://docs.fallow.tools/configuration/suppression) or `// fallow-ignore-*` / `@public` as appropriate.

## Commit message format (conventional commits)

All commit messages **must** follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body — why, not what]
```

**Allowed types:** `feat` · `fix` · `docs` · `style` · `refactor` · `perf` · `test` · `chore` · `ci` · `build` · `revert`

- `feat`: new capability visible to a user or caller
- `fix`: corrects broken behavior
- `chore`: tooling, deps, config — no production behavior change
- `refactor`: restructuring with no behavior change
- `docs`: documentation only
- Scope is optional but preferred when it narrows the area (e.g. `feat(auth):`, `fix(api):`).
- Subject line: imperative mood, lowercase after the colon, no trailing period, ≤72 chars.
- No vague subjects like `fix stuff`, `update`, `changes`. If you can't name what changed, split the commit.

## Principles (short)

- One commit = one buildable story. Coupled edits together (export + all imports, signature + all callers, component + styles + tests). Mechanical/format-only in its own commit. Message body: **why**, not only what.

## Flow

1. `git status -s` · `git diff --stat` · `git log -10` — understand WIP. Compare to merge-base if a long branch.
2. **Check branch:** `git branch --show-current`. If it is `main`, branch immediately — `git switch -c <user>/<area>-<slug>` — before touching anything else. Also branch if the current branch’s PR is already merged (see Safety). Infer the user prefix from existing branch names (`git branch` with `/`).
3. **Group** into commits (list plan: title, why, files per commit; ask if unclear).
4. `git add` / `git add -p` → `git commit` with heredoc message.
5. After all commits: `git log --oneline`, spot-check `git show --name-only` per commit.
6. **Push before calling the commit done:** `git ls-remote --heads origin <branch>` empty → `git push -u origin <branch>`. Else `git fetch origin <branch>` then push or force-with-lease as needed. `git status -s` after push.
7. **PR before calling the commit done:** `gh pr view` if one exists; otherwise `gh pr create` with `## Summary` + `## Test plan` + `## Coverage` (paste Vitest % from `pnpm test:coverage` or point to the CI **Coverage** summary; note any waiver vs the gate in `vite.config.ts`). Return the PR URL.

## Common

- **Split** last bad commit: `git reset --soft HEAD~1`, unstage, recommit in chunks.
- **Squash** last N: `git reset --soft HEAD~N` then one new commit.
- **Fixup rebase:** `git commit --fixup` … `GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash <merge-base>` (details in **fix-comments** / team docs).

## Avoid

Broken intermediate commits, unrelated mixes, non-conventional or vague subjects (`fix stuff`, `update`, `changes`), schema changes without generated artifacts, code without its tests in the same logical commit when they belong together.
