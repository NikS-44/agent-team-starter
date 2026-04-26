## Summary

- What changed and why (1–2 sentences)

## Test plan

- [ ] `pnpm verify` (or equivalent checks for this change)

## Coverage

- **Meets client Vitest gate (see `vite.config.ts` `test.coverage` and `src/coverage/coverageScope.ts` scope)?** yes / no
- **Pasted or linked:** lines % / statements % / functions % / branches % (from `pnpm test:coverage` locally, or the **Coverage summary** in the latest CI run)
- **Optional:** **Patch coverage (issue #31)** — sticky **comment** + **Check run** annotations on the PR `Files` tab (max 50 per run; not every `+` line, instrumented lcov `DA` lines only); informational unless `PATCH_COVERAGE_MIN_PCT` is set; the hard gate is still global client thresholds from `pnpm verify`
- **Aspirational 100%:** if any metric is below 100% or the gate is waived, explain briefly, link a follow-up issue if applicable, and name who approved the exception if required by your team

## Verification

- Commands run, Fallow verdict, screenshots or API notes as needed

## Breaking / follow-ups

- None, or list
