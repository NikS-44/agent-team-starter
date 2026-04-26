---
name: architecture-adr
description: Plan and document architecture decisions for significant boundaries, dependencies, storage choices, API contracts, migrations, or cross-system changes. Use when work is large, ambiguous, risky, or needs an ADR-style decision record.
---

# Architecture / ADR

Use before implementation when a change has meaningful trade-offs or affects multiple ownership boundaries.

## Trigger Examples

- Adding or replacing a dependency, framework, MCP, persistence layer, or API style.
- Changing API contracts, routing structure, database schema strategy, or state ownership.
- Refactoring shared modules or behavior used by several pages/services.
- Introducing feature flags, migrations, background jobs, auth, observability, or deployment behavior.

## Decision Flow

1. **Context** — summarize the problem, current behavior, and constraints from `CLAUDE.md`.
2. **Forces** — name the trade-offs: type safety, testability, performance, rollout, migration, developer experience, security.
3. **Options** — compare 2-3 viable approaches, including “keep current pattern” when reasonable.
4. **Decision** — choose the smallest approach that satisfies the requirement and matches repo conventions.
5. **Consequences** — call out follow-up work, risks, rollback path, and verification.
6. **Handoff** — if implementing, identify files, tests, and skills to use next.

## Lightweight ADR Template

```markdown
# ADR: <decision>

## Context

## Options

## Decision

## Consequences

## Verification
```

## Repo Defaults

- Prefer the existing stack before adding technology: React, TypeScript strict, Hono, Drizzle, Zod, TanStack Query/Router, Zustand, Vitest, Playwright, Biome, oxlint, Fallow.
- Query keys come from the `queryKeys` factory.
- Zod defines API boundaries.
- UI/routing changes need `chrome-devtools-verify` when MCP works.
- DB/API/schema changes need `drizzle-db-verify`.
