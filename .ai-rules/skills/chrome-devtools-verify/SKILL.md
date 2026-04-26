---
name: chrome-devtools-verify
description: >-
  Chrome DevTools MCP: navigate, snapshot, screenshot (including before/after on
  interactive flows), console/network. Use for UI sign-off; complements tests.
  Read MCP tool JSON before calling.
---

# Chrome DevTools MCP (UI verification)

**When:** App UI or routes changed — run this **if MCP is connected**; if not, state that under PR **Verification** and rely on tests (see `CLAUDE.md`).

**Setup:** Dev server e.g. `pnpm dev` or `pnpm dev:ready` (note Vite URL, often `:5173`). Read descriptors under your IDE’s `mcps/` (server id e.g. `user-chrome-devtools`).

| Step | What |
|------|------|
| Open | `navigate_page` / `list_pages` — full URL + path + hash if needed |
| Structure | `take_snapshot` — use fresh `uid`s after navigation |
| Evidence | `take_screenshot` — `filePath` e.g. `verification/<branch>/01-happy.png`; `fullPage: true` for wide pages; element shots use `uid` |
| Before / after | Whenever the feature **changes** the UI (modal, sheet, sidebar, toggle, filter, submit, error state): **`take_screenshot` before** the interaction, then `click` / `fill` / `type_text` (focus first), `take_snapshot`, then **`take_screenshot` after**. Use paired names, e.g. `02-before-open-dialog.png` → `03-after-open-dialog.png`, same `fullPage` / viewport unless you are doing an element shot (`uid`). |
| Interact | `click`, `fill`, `type_text` — focus first |
| Console | `list_console_messages` — at least `error` + `warn` |
| Network | `list_network_requests` after exercising the feature |
| **Ship report (this repo)** | **Always** after the feature under test: `navigate_page` to **`/ship-report`** (same origin as Vite, e.g. `http://localhost:5173/ship-report`). `take_snapshot` (and screenshot to `verification/<branch>/…` when useful). In **`list_network_requests`** (include **`fetch`** / **`xhr`**), confirm **`GET /api/ship-verify`** returned **200** and note status in the report. Re-check **console** on that page if the dialog or feature left errors—you want a clean read for ship-report too. |

Cover **happy** path and **error/empty** if relevant; optional narrow viewport (`resize_page`). For **error/empty** flows, treat the empty or error surface as the “after” shot (or capture before submit vs after failed submit) so reviewers see the delta.

**Order:** Verify the **changed route or UI** first (navigate → snapshot → **baseline screenshot** → interact → snapshot → **after screenshot** when applicable → console/network for that flow), then run the **ship-report** step above. Do not skip ship-report for “UI-only” PRs—the page is the app’s **ship smoke** surface and catches broken API wiring unrelated to your diff size.

## Compare `main` vs feature branch (paired evidence)

Use when reviewers need **baseline vs change** on the same route (scroll jumps, layout, new UI), not only “current branch looks fine.”

**Orchestration:** Cursor command **`verify-compare-main`** (`.ai-rules/commands/verify-compare-main.md`) — **commit** (or stash) first, run quality gates on the feature branch, then **`git checkout main`** → `dev:ready` → Chrome MCP → `dev:stop` → **`git checkout` feature** → repeat with **identical** URL, viewport, and interactions.

**Naming:** Under `verification/<branch-or-ticket>/`, prefix files so pairs are obvious:

- `main-01-<route>-load.png` / `branch-01-<route>-load.png`
- Same numbering for optional before/after pairs: `main-02-before-…` / `main-03-after-…` and `branch-02-before-…` / `branch-03-after-…`

**Report:** A short table — **Main** column vs **Branch** column — describing behavior each screenshot shows, then list all paths. This is a **human** diff; automated pixel diff is Playwright territory, not this MCP flow.

**Caveats:** Lockfile or env differences between `main` and the branch can skew the UI; run `pnpm install` when refs diverge. Always return to the feature branch and `dev:stop` when finished.

## PR images without committing binaries

- Prefer `scripts/pr-comment-verify-gist.sh <PR#> *.png` from repo root (`gh auth` required). `gh gist create` often rejects binaries — the script or **browser** gist upload + raw URL workarounds; commit SHA + `?raw=true` blob URLs are another option (see script comments / older ship docs).
- **Video:** not required here; use screenshot sequences or upstream screencast tools if needed.

## Report (for PR or chat)

1. **Summary** — 1–2 sentences  
2. **Scope** — paths / routes  
3. **Verification** — URLs, flows checked (feature route **and** `/ship-report`)  
4. **Evidence** — screenshot paths in order; for interactive flows, list **before** then **after** pairs (and ship-report shots when captured)  
5. **Console / network** — clean or list issues; **explicitly** note **`GET /api/ship-verify`** status from network  
6. **Follow-ups** — optional  

**This repo:** Feature demos: `/components-demo`, `/dashboard-demo`. **Ship smoke (required in this skill):** **`/ship-report`** with **`GET /api/ship-verify` → 200** in network after load. Honest “story” = shots inside **AppShell** with real nav (feature page + ship-report as applicable).

**Checklist**
- [ ] Snapshot after each navigation  
- [ ] ≥1 screenshot to `filePath` when possible; **if the UI changes with interaction**, paired **before** + **after** screenshots with clear filenames  
- [ ] Ship-report screenshot (**`…-ship-report.png`** or similar) when you captured it  
- [ ] Console errors/warns noted (feature page and ship-report)  
- [ ] Network for features that fetch; **plus** ship-verify **200** on `/ship-report`  
- [ ] **`/ship-report`** opened and documented in the report (not optional)  
- [ ] Report lists file paths  

**With stack:** New routes → **route** skill (`route/SKILL.md`). **DB-only** change → **drizzle-db-verify**, not a browser block. This skill does **not** replace `pnpm test` / `pnpm typecheck`.
