---
name: strict-tdd
description: Enforce red-green-refactor for behavior changes. Use when adding features, fixing bugs, changing API behavior, or when the user asks for TDD, tests first, regression coverage, or strict test discipline.
---

# Strict TDD

Use for meaningful behavior changes. Docs-only, pure formatting, generated migrations, and mechanical renames may skip TDD with a short note.

## Red-Green-Refactor

1. **Red** — write the smallest failing test that describes the desired behavior or regression.
2. Run the targeted test and observe the expected failure. If the test unexpectedly passes, tighten the assertion before coding.
3. **Green** — implement the smallest change that makes the test pass.
4. Run the targeted test until green.
5. **Refactor** — clean up names, structure, and duplication without changing behavior.
6. Run the targeted test again, then broaden verification based on risk.

## Test Targets

- API contracts: schema parsing, status codes, error bodies, empty states.
- TanStack Query hooks: query keys, mutation invalidation, loading/error states.
- UI: user-visible behavior with React Testing Library; add Chrome DevTools verification for changed UI/routes when MCP works.
- DB/server: include `drizzle-db-verify` when touching `db/`, `server/`, `drizzle/`, or shared server schemas.

## Discipline

- Do not batch several unverified fixes together.
- Prefer one behavior per test.
- Keep tests user-facing where possible; avoid testing implementation details.
- If a failing test cannot be created first, explain why and add regression coverage immediately after reproducing the issue another way.
- Never remove or weaken tests only to make a change pass.

## Finish

Report:

- the failing test observed,
- the implementation path,
- final targeted test command,
- broader verification command if run.
