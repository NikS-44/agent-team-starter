---
name: drizzle-db-verify
description: >-
  Verify SQLite + Drizzle schema, migrations, and HTTP API match the spec after
  changes under db/, server/, drizzle/, or shared Zod API schemas. Use for
  backend/data work; pair with tests — no separate Drizzle MCP required.
---

# Drizzle / API verification (this repo)

Use this when the plan touches **persistence or HTTP handlers**: `db/schema.ts`, `db/client.ts`, `server/**`, `drizzle/**`, or Zod bodies in `src/api/*.schemas.ts` that the server imports.

## 1. Schema and migrations

- After **any** `db/schema.ts` change, run **`pnpm db:generate`** and commit new files under `drizzle/` when the kit produces a migration.
- Ensure the server still applies migrations on boot (`server/index.ts` uses `migrate`). If you only need to refresh a dirty local file DB, **`pnpm db:push`** is acceptable for local dev; **prefer committed migrations** for anything that should ship.

## 2. Automated proof (required)

- **`pnpm test`** — green. Extend or add tests for new rules (validation, status codes, uniqueness, not-found).
- Client hooks are usually tested against **MSW**; when behavior is **server-only**, still encode the contract in tests (Zod parse, error shapes) and add tests that fail if the contract drifts.

## 3. Live stack smoke (required for DB/API changes)

Prove the **real** Hono + SQLite path, not only mocks:

1. **`pnpm dev:ready`** — waits until Vite answers on port **5173** (API proxied from there).
2. **Ship report shortcut:** open **`/ship-report`** in the browser. The **Backend & database** card loads **`GET /api/ship-verify`**, which reads SQLite (including the Drizzle migration journal row count). Confirm **200**, **All checks passed**, and sensible **Users rows** / **migrations** counts. Chrome DevTools MCP can use this page for screenshots + `list_network_requests` in one place.
3. Still exercise feature endpoints: e.g.  
   `curl -sS "http://127.0.0.1:5173/api/users"`  
   (or **`http://127.0.0.1:8787/api/...`** directly). Assert status codes, JSON shape, and error bodies for invalid input / conflicts.
4. **`pnpm dev:stop`** when finished.

If the spec adds mutations, exercise **POST/PATCH/DELETE** with `curl` (or an HTTP client) and confirm **GET** reflects the expected state.

## 4. Report

In the handoff or PR notes, briefly list: migrations generated (yes/no), tests added/updated, and **one line per curl** (method + path + expected status) you ran against the live dev stack.

## When not needed

Skip this block for **pure UI** changes that do not alter `db/`, `server/`, `drizzle/`, or server-facing schemas — those still need normal test + lint + fallow; use **chrome-devtools-verify** when the UI changes.

## Extending `/api/ship-verify`

The ship-report card is driven by **`GET /api/ship-verify`** in `server/index.ts`. Today it checks the **`users`** table row count and the Drizzle **`__drizzle_migrations`** journal. When you add tables or critical invariants, extend that handler (and the Zod schema in `src/api/shipVerify.schemas.ts`) so the page stays an honest smoke test.
