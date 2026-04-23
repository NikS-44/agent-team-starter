---
description: Run Phase 3 Chrome DevTools verification against the current branch
argument-hint: [feature-url-path]
---
You are the Lead running an ad-hoc verification pass. No planning, no tests, no PR — just verify the current working tree renders and behaves correctly.

Target path: $ARGUMENTS (default: /)

Steps:

1. Ensure working tree typechecks and builds:
   - `pnpm typecheck && pnpm lint && pnpm build`
   - If any fail, stop and report. Do not proceed to browser checks.

2. Start dev server: `pnpm dev:ready`
   - If this fails, report the tail of the log and stop.

3. Spawn `builder` with scope: "Phase 3 verification only. Do not modify any source files. Do not write tests. Follow the Phase 3 checklist in your agent definition against the URL path: $ARGUMENTS"

4. When Builder returns:
   - Run `pnpm dev:stop`
   - Summarize findings: console status, network status, screenshots, any performance insights
   - If Builder found issues, list them as a checklist but do not fix them (that's a separate `/ship` or `/ship-light` run)

Hard rules:
- This command never edits files. If verification reveals bugs, report them and exit — do not attempt fixes.
- Always run `pnpm dev:stop` in cleanup, even on error.
