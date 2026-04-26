---
name: coverage-gate
description: >-
  Enforces the repo client Vitest coverage gate and PR reporting. Use when
  writing or reviewing tests, before merge, or when the user asks about coverage
  %, `pnpm test:coverage`, or PR Coverage sections.
---

# Coverage gate (client Vitest)

## Where it is defined

- **Thresholds, scope, excludes:** `vite.config.ts` → `test.coverage` (V8, `json-summary` + `lcov` under `coverage/`).
- **Enforcement:** `pnpm verify` runs `pnpm test:coverage` via `scripts/verify.sh`.
- **Aspirational target:** 100% lines where practical; **hard gate** is the line/statement minimum in config (and secondary function/branch floors).

## What the agent should do

1. After behavior changes, run **`pnpm test:coverage`** or full **`pnpm verify`** before claiming done.
2. If coverage fails, add or extend tests; do not weaken the gate in config without human approval and a **PR Coverage** waiver.
3. In PRs, paste or link **lines / statements / functions / branches** (from the command output or CI **Test coverage (Vitest)** job summary). If any metric is below 100% or the gate, document **why** and **follow-up** in **Coverage** (see `CLAUDE.md` and `.github/pull_request_template.md`).

## What this does not cover

- **Server/DB** runtime code is not in the default client Vitest include list; use **drizzle-db-verify** and/or separate server test strategy when you add `server/**` or `db/**` tests. Optional **per-PR patch/diff** reporting (no third-party) is tracked in GitHub: https://github.com/NikS-44/agent-team-starter/issues/31
