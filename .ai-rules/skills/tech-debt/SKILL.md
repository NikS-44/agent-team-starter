---
name: tech-debt
description: Assess and plan technical debt cleanup using Fallow audit, health, dead-code, and duplication signals. Use when users mention tech debt, cleanup, dead code, complexity, duplication, refactoring priority, or code health.
---

# Tech Debt

Use this skill to turn cleanup into a prioritized plan before deleting or refactoring broadly.

## Evidence First

Prefer Fallow MCP tools when available:

- `audit` for changed-file dead code, complexity, and duplication.
- `check_health` for complexity hotspots.
- `find_dupes` for clone groups.
- `analyze` or `check_changed` when a broader read is needed.

CLI fallbacks:

- `pnpm fallow audit`
- `pnpm fallow health`
- `pnpm fallow dead-code`
- `pnpm fallow dead-code --production` before deleting code

## Workflow

1. Define the cleanup scope: branch diff, directory, feature area, or production-only code.
2. Gather Fallow results and recent git/test context; do not rely on hunches alone.
3. Classify items by impact: correctness risk, maintenance cost, user-facing blast radius, and ease of verification.
4. Recommend small batches. Each batch should be independently reviewable and testable.
5. Before deletion, confirm production reachability with Fallow and local usage search.
6. Preserve public interfaces, persisted data, migrations, and shipped behavior unless the user explicitly wants a breaking cleanup.
7. Verify with targeted tests, then `pnpm fallow audit`; run broader `pnpm verify` for shared or risky changes.

## Output

Use this format for cleanup plans:

```markdown
## Findings
- [severity] path/symbol: reason and evidence

## Recommended Batches
1. Scope, expected change, verification

## Risks
- Compatibility, data, or UI concerns
```

## Avoid

- Large opportunistic refactors.
- Deleting code only because it looks unused.
- Suppressing Fallow findings without a reason.
- Mixing mechanical cleanup with behavior changes in one commit.
