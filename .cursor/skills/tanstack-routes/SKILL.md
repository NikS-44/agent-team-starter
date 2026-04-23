---
name: tanstack-routes
description: >-
  Add or change TanStack Router routes in this app and keep the shell nav in sync.
  Use when creating pages, new URLs, or wiring the sidebar in agent-team-starter.
---

# TanStack Router + app shell (this repo)

## Files to touch

| Change | File |
|--------|------|
| New page component | `src/pages/<Name>Page.tsx` (or colocate under `src/features/...`) |
| Register route, redirects | `src/router.ts` |
| Sidebar / top layout labels | `src/components/layout/AppShell.tsx` — `mainNav` array |
| App chrome | `src/App.tsx` (usually unchanged; `Outlet` only) |
| JSDOM tests for routes | `src/router.test.tsx` (and feature tests as needed) |

## Checklist

1. **Create the page** — export a function component. Use a clear `<h1>` for a11y and tests.
2. **Add a `createRoute`** in `src/router.ts`:
   - `getParentRoute: () => rootRoute`
   - `path: "/your-segment"`
   - `component: YourPage`
3. **Attach to the tree**: `rootRoute.addChildren([...existing, yourRoute])` — keep order consistent (group related routes if you like).
4. **Root redirect** — `/` is handled by `indexRoute` with `redirect` to `/users`. If the product default should change, edit that `beforeLoad` only; do not duplicate redirects.
5. **Navigation** — append to `mainNav` in `AppShell.tsx` with `to`, `label`, and a `lucide-react` icon. Active state uses `pathname === item.to` or `pathname.startsWith(\`${item.to}/\`)` for nested routes.
6. **Types** — `Register` in `router.ts` picks up the router type; new routes need no extra declaration if they use the shared `createAppRouter` pattern.
7. **Tests** — add a `renderWithRouter({ initialPath: "/your-segment" })` case; assert the page heading (or a stable landmark). The **`/ship-report`** route is reserved for the ship workflow checklist; do not repurpose it for product features.

## Conventions

- Use `@tanstack/react-router`’s `Link` for in-app links (see `AppShell` and existing pages).
- **Do not** add `baseUrl` to `tsconfig.json` for `paths` — this project uses Vite `resolve.alias` + `paths` without `baseUrl` for `tsgo` compatibility; imports use `@/...` as configured.

## MSW and data

- List/detail pages that call the API should keep using existing MSW handlers in tests (`src/mocks/`) and `renderWithRouter` (includes `QueryClient` + `TooltipProvider`).
