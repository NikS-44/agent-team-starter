# Definition of Done
- Green: `pnpm typecheck && pnpm test && pnpm lint && pnpm build`
- Tests cover: happy path, error path, empty/null, boundary, loading + error states
- UI changes verified via Chrome DevTools MCP (console clean, network clean, screenshots of happy + error paths attached to PR)
- No `any`, no `@ts-ignore`, no `console.log`, no `biome-ignore` without a comment

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
