---
description: Commit UI work, then Chrome DevTools on main vs this branch (paired screenshots + behavior notes)
argument-hint: [feature-url-path]
---
**Purpose:** Capture the **same URL** on **`main`** and on the **current feature branch** so reviewers see baseline vs change (scroll, layout, new controls). Path: $ARGUMENTS (default `/` — use e.g. `/components-demo` when verifying that route).

**Not** a pixel-diff tool: you get **two screenshot sets** plus a **written** comparison. For automated image baselines, use Playwright visual tests separately.

### 0. Preconditions

- **Commit first** if you have local UI/source changes (use the **commit** skill or `git commit`). This flow uses `git checkout` and needs either a **clean** working tree or an explicit **`git stash push -u -m verify-compare-main`** before step 2 (remember `git stash pop` after).
- Record the feature branch: `FEATURE=$(git branch --show-current)`. If `FEATURE` is `main`, stop — there is nothing to compare.

### 1. Quality gates (on the feature branch, before switching)

`pnpm typecheck && pnpm lint && pnpm build` — fail → stop.

### 2. Capture on `main`

1. `git checkout main` && `git pull` (pull optional if you already track remote `main`).
2. `pnpm install` if `package.json` / lockfile differs from what you had on the feature branch (otherwise skip).
3. `pnpm dev:ready` — fail → log tail, `git checkout "$FEATURE"`, `pnpm dev:stop`, stop.
4. **Chrome DevTools MCP** (read tool JSON first): same Phase 3 steps as **chrome-devtools-verify** for URL $ARGUMENTS — `navigate_page`, `take_snapshot`, `take_screenshot` with **`filePath`** under `verification/<branch-or-ticket>/` using the **`main-`** prefix, e.g. `main-01-load.png`, `main-02-after-interaction.png`. Match viewport (and `fullPage` flag) to what you will use on the branch.
5. Optional but recommended: **`/ship-report`** on `main` with a `main-…-ship-report.png` name; note **`GET /api/ship-verify`** in network.
6. `list_console_messages` (`error` + `warn`) for the navigations on this server run.
7. `pnpm dev:stop`.

### 3. Capture on the feature branch

1. `git checkout "$FEATURE"`.
2. `pnpm dev:ready` — fail → log tail, stop.
3. Repeat the same navigations and **the same interactions** (if any) as on `main`; save screenshots with the **`branch-`** prefix, e.g. `branch-01-load.png`, paired with the same numbers as `main-*`.
4. Optional: **`/ship-report`** → `branch-…-ship-report.png`; confirm ship-verify **200**.
5. `list_console_messages` for this run.
6. `pnpm dev:stop`.

### 4. Report (PR or chat) — required

Use a **side-by-side** description:

| # | Main (`main-…`) | Branch (`branch-…`) |
|---|-----------------|---------------------|
| 01 | Short sentence: what the user sees (scroll position, broken/missing UI, etc.) | Short sentence: what changed |

Then list **full paths** to every `main-*` and `branch-*` file. Note console/network deltas if relevant.

### 5. Cleanup

- End on **`git checkout "$FEATURE"`** so the repo is back on the feature branch.
- Always **`pnpm dev:stop`** after each dev server segment, including on errors.

**Rules:** This command edits **git state** only via checkout (and optional stash). It does not implement features. If `main` cannot run (e.g. missing migrations), say so in the report and fall back to single-branch **verify** plus a short explanation.
