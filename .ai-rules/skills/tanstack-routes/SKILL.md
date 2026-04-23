---
name: tanstack-routes
description: Add/change TanStack Router routes; keep `AppShell` nav in sync.
---

# Routes + shell

| Task | File |
|------|------|
| Page | `src/pages/<Name>Page.tsx` |
| Register route | `src/router.ts` — `createRoute` + add to `rootRoute` children |
| Nav | `src/components/layout/AppShell.tsx` — `mainNav` |
| JSDOM | `src/router.test.tsx` |

1. **Route** — `getParentRoute: () => rootRoute`, `path`, `component`, add to **children** list in a sensible order.  
2. **Redirect** — `/` index redirect lives in `indexRoute` `beforeLoad` (e.g. to `/users`); don’t duplicate.  
3. **Nav** — `mainNav` entry: `to`, `label`, `lucide` icon. Active: `pathname === item.to` or `startsWith` for nested.  
4. **Tests** — `renderWithRouter({ initialPath: "…" })` + assert heading/landmark.  
5. **`/ship-report`** is for the ship checklist — don’t repurpose for product.

**Conventions** — In-app `Link` from TanStack. **No** `baseUrl` in `tsconfig` for paths — this repo uses Vite `resolve.alias` + `paths` (see existing config). **MSW** — reuse `src/mocks/`, `renderWithRouter` + `QueryClient` + `TooltipProvider` in tests.
