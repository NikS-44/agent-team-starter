# Definition of done
- `pnpm typecheck && pnpm test && pnpm lint && pnpm build` — green
- `pnpm fallow audit` — verdict `pass` or `warn` (not `fail`)
- Tests: happy, error, empty/null, boundaries, loading + error where relevant
- **UI / routes** (e.g. `src/pages/**`, `src/components/**`, `src/router.ts`, layout, `src/index.css`): when **Chrome DevTools MCP works**, run **chrome-devtools-verify** (console/network, `take_screenshot` + `filePath` under `verification/<branch-or-ticket>/`, `/ship-report` if in scope). For **main vs branch** behavior (e.g. scroll or layout regressions), use **`verify-compare-main`** (`.ai-rules/commands/verify-compare-main.md`) after committing, then describe paired `main-*` / `branch-*` screenshots in the PR. If MCP is down, say so in PR **Verification**; Vitest/build still count — not a hard blocker.
- **DB / API / schema:** migrations, green tests, live smoke per **drizzle-db-verify** (`pnpm dev:ready`, hit `/api/...`, `pnpm dev:stop`)
- No `any`, no `@ts-ignore`, no `console.log`, no `biome-ignore` without a reason

# Fallow
- After substantive edits: `pnpm fallow` or `pnpm fallow audit` (CI gate; scopes to changed files)
- Before deleting code: `fallow dead-code --production` to confirm reachability
- In agents, prefer Fallow **MCP** tools (`fallow_audit`, etc.) over ad-hoc CLI in loops

# Stack
- React 18+, TypeScript strict
- **Zustand** — client UI/session only. **TanStack Query** — server data (never both for the same data)
- **Zod** at API boundaries; types via `z.infer`
- **Vitest** + RTL; Playwright for E2E. **Biome** for format/lint (with **oxlint** in this repo)
- `queryKey` from a `queryKeys` factory only — no inline keys in components
- Mutations: `invalidateQueries` by key, not ad-hoc refetch

# Agents
- **Architect / critic / reviewer:** read-only
- **Builder:** implements `src/`, `tests/`; full verify before “done”
- Blocked → escalate to Lead; max two silent retries

# Config layout
- **Source of truth:** `.ai-rules/` only (skills, rules, commands, agents, `mcp.json`)
- `.cursor` / `.claude` = symlinks; missing → `pnpm run ai-rules:link` (also `postinstall`)
