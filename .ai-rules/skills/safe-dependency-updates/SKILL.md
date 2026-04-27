---
name: safe-dependency-updates
description: >-
  Identifies outdated dependencies (including install-time warnings), builds a
  semver and changelog-driven risk matrix, and orchestrates Lead/Architect/Critic/
  Builder/Reviewer agents for cautious, batched upgrades with full verify. Use when
  updating npm/pnpm packages, dependency hygiene, major bumps, audit remediation,
  or when install output lists deprecated or mismatched peers.
---

# Safe dependency updates

Treat dependency work like a **controlled release program**: discover everything that is stale, **read the changelogs before touching versions**, classify risk, then land **small, reversible PRs** with green `pnpm verify`.

## Discovery (full candidate set)

Run from repo root and capture outputs in the risk matrix.

1. **Declared drift:** `pnpm outdated` (all dependency types).
2. **Install-time signals:** `pnpm install` and copy every warning about outdated, deprecated, extraneous, or peer-mismatched packages. Use `pnpm why <package>` for anything unclear.
3. **Security:** `pnpm audit` (or `pnpm audit --json`). CVEs elevate severity and often justify an expedited path — still read release notes.
4. **Lockfile truth:** The matrix should reflect **what the lock actually resolves**, not only `package.json` ranges.

Anything reported as outdated or risky during install **must** appear in the matrix as "in scope" or "deferred" with a reason.

## Changelog and compatibility review (non-negotiable)

Before changing a version:

1. **Release notes / CHANGELOG** on the package repo.
2. **Migration guide** (often linked from major releases).
3. **Diff** between current locked version and target on GitHub.
4. **Peer and engine fields** in the new version (`peerDependencies`, `engines`, `exports`).

Explicitly scan for: breaking API removals, renamed options, default behavior changes, dropped Node/browser support, ESM/CJS boundary changes, TypeScript type breaking changes, bundler plugin requirements, deprecated APIs you still call.

Assume **major** = breaking until the changelog proves otherwise. **Minor** can break types or timing; still skim notes.

## Risk matrix (required artifact)

One row per **upgrade unit** (single package or tight ecosystem cluster updated together):

| Package(s) | Current (lock) | Target | Semver bump | Source | CVE? | Changelog signals | Blast radius | Batch ID |
|---|---|---|---|---|---|---|---|---|

**Severity triage:**
- **Critical:** known exploit, data risk, or broken build.
- **High:** major semver, native modules, router/framework core, or packages that touch many imports.
- **Medium:** minor/patch with behavior or type churn in release notes.
- **Low:** patch with narrow surface and clear notes.

**Ordering:** security fixes first → leaf deps with small blast radius → patches and minors → majors (one focused PR each; never mix unrelated majors).

## Agent deployment

**Lead** (`.ai-rules/agents/lead.md`) for branch scope: **one batch = one branch/PR** unless trivial patch-only sweeps are pre-approved in the matrix.

| Phase | Agent | Responsibility |
|-------|--------|----------------|
| Plan | **Architect** | Ordered batches, changelog citations, migration steps, test plan |
| Gate | **Critic** | Red-team: missed breaking changes, peer conflicts, missing rollback. **BLOCK** until addressed. |
| Implement | **Builder** | Apply version/lock changes for one batch; run `pnpm verify` |
| Ship | **Reviewer** | PR text: semver, changelog highlights, Breaking section, Coverage numbers |

**Native / server / DB packages:** include **drizzle-db-verify** when those layers are affected. **UI/router bumps:** prefer **chrome-devtools-verify** when MCP is available.

## Deferred work

Record **blocker**, **owner**, and **next trigger** for any package that cannot be upgraded yet (e.g. "waiting for Node 22" or "blocked on Storybook major").

## Output checklist

- [ ] Risk matrix complete; majors and native modules flagged; changelog cited per row.
- [ ] Architect plan → Critic approval → Builder implementation → Reviewer PR.
- [ ] `pnpm verify` green.
