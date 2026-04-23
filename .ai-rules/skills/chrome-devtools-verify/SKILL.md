---
name: chrome-devtools-verify
description: >-
  Chrome DevTools MCP: navigate, snapshot, screenshot, console/network. Use for UI
  sign-off; complements tests. Read MCP tool JSON before calling.
---

# Chrome DevTools MCP (UI verification)

**When:** App UI or routes changed — run this **if MCP is connected**; if not, state that under PR **Verification** and rely on tests (see `CLAUDE.md`).

**Setup:** Dev server e.g. `pnpm dev` or `pnpm dev:ready` (note Vite URL, often `:5173`). Read descriptors under your IDE’s `mcps/` (server id e.g. `user-chrome-devtools`).

| Step | What |
|------|------|
| Open | `navigate_page` / `list_pages` — full URL + path + hash if needed |
| Structure | `take_snapshot` — use fresh `uid`s after navigation |
| Evidence | `take_screenshot` — `filePath` e.g. `verification/<branch>/01-happy.png`; `fullPage: true` for wide pages; element shots use `uid` |
| Interact | `click`, `fill`, `type_text` — focus first |
| Console | `list_console_messages` — at least `error` + `warn` |
| Network | `list_network_requests` after exercising the feature |

Cover **happy** path and **error/empty** if relevant; optional narrow viewport (`resize_page`).

## PR images without committing binaries

- Prefer `scripts/pr-comment-verify-gist.sh <PR#> *.png` from repo root (`gh auth` required). `gh gist create` often rejects binaries — the script or **browser** gist upload + raw URL workarounds; commit SHA + `?raw=true` blob URLs are another option (see script comments / older ship docs).
- **Video:** not required here; use screenshot sequences or upstream screencast tools if needed.

## Report (for PR or chat)

1. **Summary** — 1–2 sentences  
2. **Scope** — paths / routes  
3. **Verification** — URL, flows checked  
4. **Evidence** — screenshot paths in order  
5. **Console / network** — clean or list issues  
6. **Follow-ups** — optional  

**This repo:** Demo: `/components-demo`, `/dashboard-demo`. **Ship / DB smoke:** open **`/ship-report`** (shell + `GET /api/ship-verify` should be **200** in network). Honest “story” = shots inside **AppShell** with real nav.

**Checklist**
- [ ] Snapshot after each navigation  
- [ ] ≥1 screenshot to `filePath` when possible  
- [ ] Console errors/warns noted  
- [ ] Network for features that fetch  
- [ ] Report lists file paths  

**With stack:** New routes → **tanstack-routes** skill. **DB-only** change → **drizzle-db-verify**, not a browser block. This skill does **not** replace `pnpm test` / `pnpm typecheck`.
