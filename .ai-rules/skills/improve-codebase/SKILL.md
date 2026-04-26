---
name: improve-codebase
description: Identify and implement scoped codebase improvements using repo conventions, Fallow signals, tests, and small reviewable batches. Use when users ask to improve, modernize, clean up, harden, simplify, or make the codebase more maintainable.
---

# Improve Codebase

Use this skill for broad improvement requests. Start by narrowing scope and finding evidence; do not begin with a large refactor.

## Improvement Areas

- Correctness: bugs, missing edge cases, unsafe assumptions.
- Maintainability: duplicated logic, unclear boundaries, oversized modules.
- Type safety: weak schemas, avoidable casts, missing invariants.
- UX quality: loading/error/empty states, accessibility, route behavior.
- API quality: validation, status codes, error shape, query invalidation.
- Code health: dead code, complexity, dependency drift, circular imports.
- Verification: missing tests, weak smoke checks, unclear PR evidence.

## Workflow

1. Clarify the target: whole repo, directory, feature, or pain point.
2. Gather evidence: tests, Fallow MCP/CLI, lints, recent diffs, bug reports, and code reads.
3. Propose 2-4 small batches ranked by impact and risk.
4. For each batch, state files, expected behavior, and verification.
5. Implement one batch at a time unless the user asks for a plan only.
6. Use `strict-tdd` for behavior changes and `systematic-debugging` for known failures.
7. Use `tech-debt` before broad cleanup or deletion.
8. Use `architecture-adr` or `design-doc` when the improvement changes boundaries or introduces a new pattern.
9. Finish with `branch-finishing` when the branch is ready for handoff.

## Guardrails

- Keep shipped behavior compatible unless the user explicitly wants a breaking change.
- Prefer existing patterns over new abstractions.
- Do not mix unrelated refactors with feature or bug-fix commits.
- Do not add dependencies until the gap is clear and documented.
- Avoid churn in generated files, lockfiles, or formatting outside the target scope.

## Report Shape

```markdown
## Findings
- Evidence-backed opportunity

## Proposed Batches
1. Change, files, risk, verification

## Completed
- What changed

## Verification
- Commands and results
```
