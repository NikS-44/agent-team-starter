---
name: branch-finishing
description: Finish a branch for handoff or PR readiness. Use when the user asks to finish, ship, hand off, prepare a PR, make a branch merge-ready, or do a final branch check before review.
---

# Branch Finishing

This skill is for branch-level readiness. For git safety, commit grouping, push, and PR mechanics, read and follow `commit/SKILL.md`.

## Finish Flow

1. **Scope** — confirm the branch is appropriate for this work. If the branch has a merged PR or unrelated scope, create a fresh branch before adding work.
2. **Status** — inspect `git status -s`, staged/unstaged diff, untracked files, and recent commits.
3. **Diff skim** — review the full branch diff against the base branch, not only the latest commit.
4. **Checks** — run the narrow checks for touched areas, then broader gates when risk warrants:
   - code/docs only: `pnpm format:check` and Fallow audit as applicable,
   - shared app code: `pnpm typecheck && pnpm lint && pnpm test:coverage && pnpm build` (or `pnpm verify`); capture coverage % for the PR,
   - DB/API/schema: `drizzle-db-verify`,
   - UI/routes: `chrome-devtools-verify` when MCP works.
5. **Fallow** — run Fallow MCP audit or `pnpm fallow audit`; fix `fail`, report `warn`.
6. **Evidence** — collect verification notes and screenshot paths for UI work. Do not commit verification PNGs unless asked.
7. **Commit readiness** — use `commit` skill to group changes into buildable commits and avoid unrelated files.
8. **PR readiness** — push/update the branch and create/update the PR with Summary and Verification sections.
9. **Clean exit** — end with clean `git status -s` or clearly report remaining intentional changes.

## PR Body Shape

```markdown
## Summary
- What changed and why

## Coverage
- Meets `vite.config.ts` gate: yes/no
- Lines / statements / functions / branches % (from local `pnpm test:coverage` or CI job summary)
- If below 100% aspirational or gate waived: reason + follow-up

## Verification
- Commands run
- Fallow verdict
- Live/API/UI evidence when relevant
```

## Stop Conditions

- Verification still fails after one focused fix round.
- The branch contains unrelated work that cannot be safely separated.
- A merged PR already exists for this branch and the user has not approved a new branch.
- Required credentials or MCPs are unavailable and the missing check is a release blocker.
