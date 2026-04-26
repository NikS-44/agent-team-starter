---
name: systematic-debugging
description: Diagnose and fix bugs through reproduction, evidence, isolation, root cause, regression tests, and verification. Use when behavior is broken, tests fail, CI fails, runtime errors appear, or the user asks to debug.
---

# Systematic Debugging

Use this when something is failing or surprising. Move from evidence to cause before editing.

## Workflow

1. **Reproduce** — identify the exact failing command, UI flow, API request, or CI check.
2. **Capture evidence** — read the error, stack, failing assertion, console/network output, or relevant logs.
3. **Narrow scope** — locate the smallest component, function, route, schema, or query involved.
4. **State a hypothesis** — one likely cause and one quick way to prove or disprove it.
5. **Test the hypothesis** — use a targeted test, small script, focused command, or code read.
6. **Fix root cause** — make one coherent change; avoid speculative multi-fix batches.
7. **Add regression coverage** — test the bug or invariant that should have caught it.
8. **Verify** — run the smallest relevant check first, then the broader gate needed for the touched area.

## Useful Checks

- Unit/API: `pnpm test <file>` or `pnpm test`.
- Types: `pnpm typecheck`.
- Lint/format: `pnpm lint`, `pnpm format:check`.
- DB/API live smoke: `drizzle-db-verify`.
- UI/browser: `chrome-devtools-verify`.
- Code health after edits: Fallow MCP or `pnpm fallow audit`.

## Reporting

Summarize:

- Reproduction.
- Root cause.
- Fix.
- Regression test.
- Verification.

## Avoid

- Editing before reproducing unless the failure is already explicit and local.
- Treating symptoms while leaving the invariant untested.
- Hiding errors with broad catches, fallback defaults, or disabled checks.
