---
name: drizzle-db-verify
description: >-
  SQLite + Drizzle: schema/migrations and live API smoke for changes under db/,
  server/, drizzle/, or shared Zod API schemas the server uses.
---

# Drizzle / API (this repo)

Use when touching **`db/`**, **`server/`**, **`drizzle/`**, or **`src/api/*.schemas.ts`** the server imports.

1. **Schema** — After `db/schema.ts` changes: `pnpm db:generate`; commit new `drizzle/` files when a migration is produced. Server boot runs `migrate` — prefer **committed** migrations; `db:push` only for local dirty DBs.
2. **Tests** — `pnpm test` green; extend tests for validation, status codes, errors, contracts.
3. **Live** — `pnpm dev:ready` → open **`/ship-report`** (card calls **`GET /api/ship-verify`**, checks SQLite + migration journal) → **200** and sane counts. `curl` feature endpoints (via Vite proxy `:5173` or `:8787`). Exercise mutations if you added them. `pnpm dev:stop`.
4. **Report** — PR / handoff: migrations y/n, tests touched, one line per live request you ran (method, path, status).

**Skip** for pure UI with no server/db/schema change — use normal tests + **chrome-devtools-verify** for UI.

**Extend** `/api/ship-verify` when you add critical invariants (handler + `shipVerify.schemas`).
