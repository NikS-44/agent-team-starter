---
name: project-api
description: Scaffold or change this repo's API flow across Hono, Zod, Drizzle, and TanStack Query. Use when adding endpoints, request/response schemas, database-backed server behavior, API clients, query keys, or mutation hooks.
---

# Project API

Use for API work that crosses `server/`, `db/`, `drizzle/`, or `src/api/`.

## Shape

| Concern | Location |
|---------|----------|
| Hono routes | `server/index.ts` |
| Server helpers | `server/*.ts` |
| Shared schemas | `src/api/*.schemas.ts` |
| Client functions + hooks | `src/api/*.ts` |
| Tables | `db/schema.ts` |
| Migrations | `drizzle/` via `pnpm db:generate` |
| Tests | colocated `*.test.tsx` / API tests under `src/api/` |

## Scaffold Order

1. **Contract first** — define Zod request/response schemas in `src/api/<resource>.schemas.ts`; export `z.infer` types.
2. **Server** — add small Hono route wiring in `server/index.ts`; move validation, persistence, and error mapping into `server/<resource>*.ts` helpers when logic grows.
3. **Database** — if schema changes, update `db/schema.ts`, run `pnpm db:generate`, and commit generated `drizzle/` files.
4. **Client** — add fetch functions in `src/api/<resource>.ts`; parse responses with Zod and parse outgoing bodies before `fetch`.
5. **Query keys** — extend the existing `queryKeys` factory; never use inline keys in components.
6. **Hooks** — use TanStack Query for server data. Mutations should invalidate by `queryKeys`, not ad-hoc refetch.
7. **UI** — components/pages consume hooks and typed schemas; keep Zustand for client UI/session state only.
8. **Tests** — cover happy, validation error, server error, empty/null, and mutation invalidation where relevant.
9. **Verify** — use `drizzle-db-verify` for `db/`, `server/`, `drizzle/`, or shared server schema changes.

## Conventions

- Zod is the API boundary; do not trust raw JSON on either side.
- Prefer narrow server helpers over expanding `server/index.ts`.
- Return clear JSON errors from API handlers; keep status-code behavior covered by tests.
- Avoid `any`, `@ts-ignore`, stray logs, and inline query keys.
- Use Context7 when Hono, Drizzle, Zod, or TanStack behavior depends on current upstream docs.
