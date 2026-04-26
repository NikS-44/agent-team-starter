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

Treat dependency work like a **controlled release program**: discover everything that is stale, **read the changelogs before touching versions**, classify risk, then land **small, reversible PRs** with green `pnpm verify` (per root `CLAUDE.md`).

Public skill ecosystems (e.g. agent-skills “dependency-updater” / “dependency-upgrade” patterns) emphasize the same pillars: **semver-aware ordering**, **changelog and breaking-change review**, **security priority**, and **staged validation**. This repo encodes that in **agent roles** and **verification**, not in ad-hoc bumps.

## Discovery (full candidate set)

Run from repo root and **capture outputs in the risk matrix artifact** (or PR appendix).

1. **Declared drift:** `pnpm outdated` (all dependency types the project uses: `dependencies`, `devDependencies`, optional peers if listed).
2. **Install-time signals (mandatory targets):** Run a clean-enough install path and record **every** package the tool names as outdated, deprecated, extraneous, or peer-mismatched:
   - `pnpm install` (or `pnpm install --frozen-lockfile` on CI) and copy warnings.
   - If resolving peers: `pnpm why <package>` for anything unclear.
3. **Security:** `pnpm audit` (or `pnpm audit --json` for sorting). CVEs **elevate** severity and often justify an expedited patch/minor path—still read release notes.
4. **Lockfile truth:** Diff `pnpm-lock.yaml` on another machine or after `git clean` if you suspect skew; the matrix should reflect **what the lock actually resolves**, not only `package.json` ranges.

**Rule:** Anything reported as outdated or risky during install **must** appear in the matrix as either “in scope for this batch” or “deferred” with a reason (e.g. blocked on another major).

## Changelog and compatibility review (non-negotiable)

Before changing a version, gather **primary** sources in this order:

1. **Release notes / CHANGELOG** on the package repo (GitHub Releases or `CHANGELOG.md`).
2. **Migration guide** (often linked from major releases).
3. **Diff or compare** between current locked version and target (tags or `vX.Y.Z`…`vA.B.C` on GitHub).
4. **Peer and engine fields** in the new version (`peerDependencies`, `engines`, `package.json` exports).

**Explicitly scan for:** breaking API removals, renamed options, default behavior changes, dropped Node/browser support, ESM/CJS boundary changes, TypeScript type breaking changes, bundler plugin requirements, and **deprecated APIs** you still call.

Assume **major** = breaking until the changelog proves otherwise. **Minor** can break types or timing; still skim notes.

## Risk matrix (required artifact)

Create a table (markdown is fine). One row per **upgrade unit** (single package or a **tight ecosystem cluster** updated together, e.g. related `@tanstack/*` pins when the project already couples them).

Suggested columns:

| Package(s) | Current (lock) | Target | Semver bump | Source (outdated / install warn / audit) | Security (CVE / none) | Changelog signals (breaking / migration / none found) | Blast radius (tooling / server / client / native addon) | Coupling (peers, workspace, framework) | Batch ID | Suggested agent pass |

**Severity triage (for ordering):**

- **Critical:** known exploit, data risk, or broken build; patch/minor first when it fixes the issue.
- **High:** major semver, native modules (`better-sqlite3`, etc.), router/framework core, or packages that touch many imports.
- **Medium:** minor/patch with behavior or type churn in release notes.
- **Low:** patch with narrow surface and clear notes.

**Ordering:**

1. Security fixes that match the triage above.
2. **Leaf** dependencies with small blast radius.
3. **Patches and minors** before **majors** unless a major blocks others.
4. **Majors:** one focused PR (or one cluster) each; never mix unrelated majors in one diff.

## Agent deployment (who does what)

Use **Lead** (`.ai-rules/agents/lead.md`) for branch scope: **one batch = one branch/PR** unless trivial patch-only sweeps are pre-approved in the matrix.

| Phase | Agent | Responsibility |
|-------|--------|----------------|
| Plan | **Architect** | Read-only upgrade plan: ordered batches, changelog citations, migration steps, files likely touched, **test plan** (what must pass: unit, e2e, smoke). Adapt the architect output format to dependency work (no feature Zod section unless APIs change). |
| Gate | **Critic** | Red-team the plan: missed breaking changes, peer conflicts, missing rollback, insufficient tests for behavior changes. **BLOCK** until addressed. |
| Implement | **Builder** | Apply version/lock changes for **one batch**; run **`pnpm verify`** (or at minimum typecheck + test:coverage + lint + build + fallow per `CLAUDE.md`). Follow **strict-tdd** when application behavior or types change—not for mechanical bumps that touch no code paths, but default to running the full suite anyway. |
| Ship | **Reviewer** | Final diff and PR text: note semver, changelog highlights, **Breaking** section, **Coverage** numbers, and any skipped browser/DB verify with reason. |

**Native / server / DB packages:** include **drizzle-db-verify** or other live smoke steps from `CLAUDE.md` when those layers are affected.

**UI/router bumps:** prefer **chrome-devtools-verify** when MCP is available.

## Implementation discipline

- Prefer **explicit version pins or caret bumps** consistent with repo convention; avoid “upgrade everything” in one commit.
- After lockfile changes: **read the diff** for unexpected transitive upgrades; if a transitive major appeared, **add a row** to the matrix or pin/resolution per team policy.
- Do not silence audit with `--force` without Lead approval and a documented exception.
- No `any`, `@ts-ignore`, or `biome-ignore` to “finish” an upgrade without cause (per `CLAUDE.md`).

## Deferred work

If a package cannot be upgraded yet, record **blocker**, **owner**, and **next trigger** (e.g. “waiting for Node 22” or “blocked on Storybook major”).

## Output checklist

- [ ] Discovery outputs attached (outdated, install warnings, audit summary).
- [ ] Risk matrix complete; majors and native modules flagged.
- [ ] Changelog/migration notes cited for each in-scope row.
- [ ] Architect plan → Critic approval → Builder implementation → Reviewer PR.
- [ ] `pnpm verify` green or documented waiver path per `CLAUDE.md`.
