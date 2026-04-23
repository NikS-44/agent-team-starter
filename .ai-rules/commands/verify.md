---
description: Run Phase 3 Chrome DevTools verification against the current branch
argument-hint: [feature-url-path]
---
Ad-hoc browser check: **no** feature implementation, **no** PR. Path: $ARGUMENTS (default `/`).

1. `pnpm typecheck && pnpm lint && pnpm build` — fail → stop.  
2. `pnpm dev:ready` — fail → log tail and stop.  
3. `builder` — “Phase 3 only; **no** file edits, **no** tests. Run Phase 3 checklist for URL $ARGUMENTS.”  
4. `pnpm dev:stop`. Summarize: console, network, screenshots. Issues → checklist only; fixes are a `/ship` or `/ship-light` run.

**Rules:** This command does not edit the repo. Always `dev:stop` in cleanup, including on error.
