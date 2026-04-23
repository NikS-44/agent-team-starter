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

Use this workflow to **prove** a feature in a real browser and **document** what shipped. The running app already uses this repo’s layout and `src/components/ui` — screenshots of feature routes *are* evidence of those components in context.

## Prerequisites

1. **MCP server** — `chrome-devtools` must be enabled (canonical config: `.ai-rules/mcp.json`, symlinked as `.cursor/mcp.json` with `chrome-devtools-mcp`). If you see a profile lock error, the project config includes `--isolated=true`; reload MCP servers after changing config. **In Claude Code**, MCP server names may differ from Cursor’s—use the id your environment’s MCP listing exposes.
2. **Tool names** — Before the first call, **read the MCP tool descriptors** under the workspace `mcps/` folder (or your IDE’s MCP listing). Server id may appear as `user-chrome-devtools` or similar — use the id your environment exposes.
3. **Dev server** — Start the app (`pnpm dev`, or `pnpm dev:ready` if your team uses the ready script). Note the **Vite URL** from the log (e.g. `http://localhost:5173` — port may differ).
4. **Schema first** — Never guess `call_mcp_tool` parameters; open the tool’s JSON descriptor and pass only supported fields.

## Core verification loop

Run this for each **URL or flow** you need to sign off.

| Step | Tooling (typical) | Notes |
|------|-------------------|--------|
| 1. Open / focus page | `list_pages`, `navigate_page` (or `new_page`) | Use full URL including path and hash if needed (`/components-demo#forms`). |
| 2. Structural + interactive check | `take_snapshot` | Use **latest** snapshot for `uid`s; tree changes after navigation. |
| 3. Still image evidence | `take_screenshot` | **Viewport:** omit `uid`. **Full page:** `fullPage: true` (no `uid`). **Region:** `uid` from snapshot. Prefer `filePath` to persist under the repo (see below). |
| 4. Typed / keyboard flows | `click`, `fill`, `type_text`, `press_key` | Focus inputs before `type_text`. |
| 5. Regressions in the console | `list_console_messages` | Filter `error` and `warn` at minimum. |
| 6. Failed requests | `list_network_requests`, `get_network_request` | After exercising the feature. |

Repeat for **happy path**, **empty/error** states, and **mobile width** if relevant (`resize_page` when available).

## Saving screenshots (artifacts)

- Prefer **`take_screenshot`** with **`filePath`** so images land in the workspace (reviewable in PRs). Example relative path: `verification/<feature-branch-or-ticket>/01-list-view.png`.
- Use **`format`**: `png` (default), `jpeg`, or `webp`; set **`quality`** for lossy formats.
- **Full-page** shots are best for “what shipped” summaries; use **element `uid`** for a specific card, form, or chart.

**Video:** The bundled MCP in this project exposes **screenshot** tools. **Screen recording / WebM** usually requires `chrome-devtools-mcp` experimental screencast + **ffmpeg** (see upstream README). If video is required and MCP cannot record, fall back to: (1) a **sequence of screenshots** with numbered filenames, or (2) asking the user to record manually while you provide a **click path**.

## Feature-done report (deliverable)

When the feature is **done**, produce a **short report** in the chat (or PR description) with this structure:

1. **Summary** — What changed in one or two sentences.
2. **Scope** — Routes/pages touched (e.g. `src/pages/FooPage.tsx`, `/foo`).
3. **Verification** — Dev server URL used; list each **path** or **flow** checked.
4. **Evidence** — List **screenshot `filePath`s** (or attached images) in order: e.g. list → detail → error state.
5. **Tooling results** — Console: clean / issues listed. Network: no unexpected 4xx/5xx for the feature’s calls.
6. **Follow-ups** — Optional tickets for a11y, E2E, or polish.

**In-browser “report” using app chrome:** The product UI is already the “story.” The most honest artifact is **screenshots of the real routes** inside **`AppShell`** (sidebar, header, your page). You do **not** need a separate “report page” unless the team adds one. For a **rich, layout-heavy** digest (galleries, side-by-side), consider a **Cursor Canvas** (see the **canvas** skill): use it when the deliverable is a **standalone visual artifact**; import rules for `.canvas.tsx` are strict (often `cursor/canvas` only), so **do not** assume you can import this app’s `src/` in a canvas — for **on-brand** reports, **screenshots of the live app** remain the default.

**Optional (repo-specific):** This template app includes demo routes such as `/components-demo` and `/dashboard-demo` for **control** and **layout** reference shots when comparing regressions. For **ship** verification, open **`/ship-report`** in the running app to confirm shell navigation and to copy the in-page **PR blurb** template.

## Checklist before saying “verified”

- [ ] `take_snapshot` used after navigation; interactions use current `uid`s.
- [ ] At least one **screenshot** of the main user-visible outcome (saved with `filePath` when possible).
- [ ] **Console** checked for `error` / relevant `warn`.
- [ ] **Network** checked if the feature fetches or mutates.
- [ ] Report lists paths, image paths, and any issues.

## coordination with this repo

- **Router / nav** — New pages belong in `src/pages/…`, `src/router.ts`, and `AppShell` `mainNav` when they should appear in the shell (see **tanstack-routes** skill).
- **Do not** replace `pnpm test` / `pnpm typecheck` with browser checks alone; MCP verification is **additive**.

## When not to use

- **Headless CI** — Use Vitest/Playwright in CI; this skill targets **agent-driven** or **local** verification.
- **No browser** — If MCP is unavailable, state that and fall back to unit/integration tests and code review.
