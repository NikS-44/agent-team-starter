---
name: design-doc
description: Write concise engineering design documents for features, refactors, APIs, migrations, or system changes. Use when the user asks for a design doc, technical proposal, RFC, implementation design, or written plan for review.
---

# Design Doc

Use for work that needs shared understanding before implementation. For short decision records, use `architecture-adr`; for implementation after approval, use the relevant build skill.

## Process

1. Clarify the goal, non-goals, constraints, and success criteria.
2. Read the current code paths before proposing changes.
3. Identify affected modules, contracts, data flow, and verification gates.
4. Compare meaningful options when trade-offs exist.
5. Recommend one approach and explain why it fits this repo.
6. Include rollout, risks, test plan, and open questions.

## Template

```markdown
# Design: <title>

## Summary

## Goals

## Non-Goals

## Current State

## Proposed Design

## Alternatives Considered

## Data / API Contracts

## Testing and Verification

## Rollout and Risks

## Open Questions
```

## Repo Guidance

- Cite specific files and existing patterns.
- Prefer existing stack choices from `CLAUDE.md` unless the design justifies a new tool.
- Include Zod schemas for API boundaries when relevant.
- Include TanStack Query key/invalidation behavior for server data.
- Include Drizzle migration and live-smoke requirements for DB/API changes.
- Include Chrome DevTools verification for UI/routes when MCP works.

## Keep It Reviewable

- Keep the main document concise; link references instead of dumping large code.
- Mark assumptions clearly.
- Separate “decision needed” from “implementation detail”.
- Do not hide unresolved trade-offs.
