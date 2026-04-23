---
name: chrome-devtools-verify
description: >-
  Verifies UI features with the Chrome DevTools MCP: navigate, snapshots, screenshots,
  console and network checks. Produces a structured “feature done” report with visual
  evidence. Use when finishing a UI/feature, before PR/ship, or when the user asks for
  browser verification, screenshots, or a visual sign-off. Complements automated tests;
  does not replace them.
---

# Chrome DevTools MCP — verification & feature reports

Use this workflow to **prove** a feature in a real browser and **document** what shipped. The running app already uses the repo’s layout and `src/components/ui` — screenshots of feature routes *are* evidence of those components in context.

## Prerequisites

1. **MCP server** — `chrome-devtools` must be enabled in the project (e.g. `.cursor/mcp.json`). If you see a profile lock error, use `--isolated=true` in MCP args and reload. In Claude Code, use whatever MCP name your environment registers for the same server.
2. **Tool names** — Read MCP tool **schemas** from the descriptor files; do not invent parameters.
3. **Dev server** — Start the app (`pnpm dev` or `pnpm dev:ready`). Use the **Vite URL** from the log (port may not be 5173).
4. **First call** — List pages / navigate, then work from a fresh **snapshot** for `uid` values.

## Core verification loop

| Step | Action | Notes |
|------|--------|--------|
| 1 | `navigate_page` to the feature URL | Include path and `#hash` for sections. |
| 2 | `take_snapshot` | Get current `uid`s. |
| 3 | `take_screenshot` | `fullPage: true` and/or `uid` for a region; use `filePath` to save under `verification/<id>/...`. |
| 4 | `click` / `fill` / `type_text` / `press_key` | Exercise the flow. |
| 5 | `list_console_messages` | At least `error` + `warn`. |
| 6 | `list_network_requests` | After API-using flows. |

Cover happy path, error/empty, and **resize** if layout matters.

## Screenshots and video

- **Images:** `take_screenshot` with `filePath` (e.g. `verification/TICKET-01-overview.png`), `format` as needed, `quality` for jpeg/webp.
- **Video:** Not guaranteed by default MCP toolsets; upstream **experimental screencast** may need **ffmpeg**. Prefer **numbered screenshots** for step-by-step flows, or ask the user to record if full video is required.

## Feature-done report template

1. **Summary** — What shipped.
2. **Scope** — Files/routes.
3. **Verified URLs** — Full links with port used.
4. **Evidence** — Screenshot paths in order.
5. **Console / network** — Pass or listed issues.
6. **Follow-ups** — Optional.

**Presenting in the “product UI”:** The best on-brand evidence is **screenshots of the live feature** inside the app shell. No separate report page is required. For a **standalone rich layout** in the IDE, a **Cursor Canvas** may apply (see project’s canvas guidance); canvas imports are often restricted, so default to **browser screenshots** for design parity.

**This repo** — Reference routes like `/components-demo` / `/dashboard-demo` for UI baseline comparisons when useful. For **ship** handoffs, include **`/ship-report`** in the checked URLs to capture the checklist and PR text template in screenshots or notes.

## Checklist

- [ ] Snapshots after navigation; `uid`s current.
- [ ] Screenshots on disk or attached.
- [ ] Console and (if relevant) network reviewed.
- [ ] Written report in chat, PR, or handoff doc.

## Boundaries

- Does **not** replace `pnpm typecheck`, `pnpm test`, or E2E CI.
- If MCP is down, state that and rely on tests + review.
