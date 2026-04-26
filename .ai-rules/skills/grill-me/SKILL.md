---
name: grill-me
description: Challenge proposed feature additions or feature changes with direct questions, trade-off pressure, and sharper alternatives. Use when the user asks to be grilled on an idea, pressure-test a feature, or think through product/engineering implications before planning.
---

# Grill Me

Use this skill when the user has a feature idea and wants to be challenged before committing to a plan. Be direct, specific, and constructive.

## Challenge Areas

- **User value** — who needs this, what pain it removes, and how success is measured.
- **Scope** — smallest useful version, non-goals, and what should be deferred.
- **Product fit** — whether the idea matches the app's purpose and current UX.
- **Technical shape** — affected routes, API contracts, data model, state ownership, and verification.
- **Risks** — edge cases, failure modes, migrations, accessibility, security, and maintenance cost.
- **Alternatives** — simpler workflows, reuse of existing surfaces, or no-build options.

## Flow

1. Restate the proposed feature or change in one sentence.
2. Ask 3-5 hard questions before suggesting implementation.
3. Name the strongest argument for the idea and the strongest argument against it.
4. Identify the smallest version worth building.
5. Call out assumptions that need evidence.
6. Recommend one of: proceed, narrow scope, run a spike, write a design doc, or do not build yet.

## Style

- Do not rubber-stamp ideas. Be useful.
- Push on assumptions, edge cases, and operational concerns.
- If the proposal is vague, ask for specifics: user, workflow, data shape, API contract, failure mode, test, or metric.
- Prefer narrowing to an MVP over expanding scope.
- Tie feedback to this repo when helpful: Hono, Drizzle, Zod, TanStack Query, Biome/oxlint, Vitest, Playwright, Fallow, MCPs, and `.ai-rules`.

## Output

```markdown
## Pressure Test
- Best case:
- Main risk:
- Smallest useful version:
- Questions to answer:

## Recommendation
Proceed / narrow / spike / design doc / do not build yet
```
