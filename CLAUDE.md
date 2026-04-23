# Definition of Done
- Green: `pnpm typecheck && pnpm test && pnpm lint && pnpm build`
- Green: `pnpm fallow audit` verdict is `pass` or `warn` — never `fail` (new dead code, duplication, or complexity regressions block merge)
- Tests cover: happy path, error path, empty/null, boundary, loading + error states
- UI / route changes: verify via Chrome DevTools MCP (console clean, network clean, screenshots of happy + error paths attached to PR) — see **chrome-devtools-verify** skill
- DB / API / schema changes: migrations + green tests + live API smoke (`pnpm dev:ready`, exercise `/api/...`, `pnpm dev:stop`) — see **drizzle-db-verify** skill
- No `any`, no `@ts-ignore`, no `console.log`, no `biome-ignore` without a comment

# Codebase intelligence (fallow)
- Run `pnpm fallow` (or `pnpm fallow audit`) after every implementation to catch dead code, duplication, and complexity regressions
- `fallow audit` scopes to changed files automatically — it is the CI gate for each PR
- `fallow dead-code --production` before deleting anything — confirm the candidate is genuinely unreachable
- `fallow health --targets` to find the highest-priority refactor targets when complexity is increasing
- Fallow MCP tools are available to agents: use `fallow_dead_code`, `fallow_health`, `fallow_audit` instead of running the CLI when inside an agentic loop

# Stack
- React 18+ with TypeScript strict mode
- State: Zustand for client state, TanStack Query for server state — never mix
- Validation: Zod schemas as the single source of truth for types at API boundaries
- Testing: Vitest + React Testing Library (units/integration), Playwright (E2E)
- Linting/Formatting: Biome (replaces ESLint + Prettier)

# Stack conventions (non-negotiable)
- Every API response is parsed through a Zod schema. Infer TS types from schemas via `z.infer`, never hand-write duplicate types.
- TanStack Query `queryKey` is a readonly tuple exported from a `queryKeys` factory. Never inline query keys in components.
- Zustand stores hold ONLY client state (UI, session, preferences). Server data lives in TanStack Query cache. If you find yourself caching fetched data in Zustand, that's a bug.
- Selectors for Zustand: always use selector functions to avoid over-rendering (`useStore(s => s.user)`, not `useStore().user`).
- Mutations invalidate queries by key, not by refetch. Use `queryClient.invalidateQueries`.

# Coordination rules for teammates
- Architect/Critic/Reviewer: READ ONLY. Never edit source files.
- Builder: owns src/ and tests/. Runs full verification before signalling done.
- When blocked, message the Lead. Never silently retry more than twice.

# Shared agent config (Cursor + Claude Code)
**Canonical** configuration lives only under **`.ai-rules/`** (`skills/`, `rules/`, `commands/`, `agents/`, `mcp.json`). Folders in `.cursor/` and `.claude/` are **symlinks** to those trees (not duplicate files). If links are missing after a clone, run **`pnpm run ai-rules:link`** (also runs on **`postinstall`**). See **`.ai-rules/README.md`**. **`.claude/settings.local.json`** is local and not part of the shared tree.
