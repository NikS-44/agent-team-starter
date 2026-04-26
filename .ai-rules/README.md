# `.ai-rules/` (canonical copy in git)

| Path | Use |
|------|-----|
| `rules/defaults.mdc` | Always-on rule: points to `CLAUDE.md` and this tree. |
| `skills/**/SKILL.md` | e.g. **chrome-devtools-verify**, **drizzle-db-verify**, **commit** |
| `commands/*.md` | Slash commands: `/ship`, `/ship-light`, `/verify` |
| `agents/*.md` | **lead** (branch / PR scope), **architect**, **critic**, **builder**, **reviewer** |
| `mcp.json` | MCP config (symlinked as `.cursor/mcp.json` after install) |

**Context7 (optional):** The **context7** server in `mcp.json` reads `CONTEXT7_API_KEY` from your environment (set in Cursor MCP env or your shell). Create a key at [context7.com](https://context7.com) (dashboard). Do not commit API keys; keep them in editor-local or OS-level config only.

## Tooling Candidates

When evaluating tool recommendations, prefer tools that fill a real gap in the current verify loop instead of duplicating checks already covered by `pnpm verify`.

| Tool area | Current repo fit |
|-----------|------------------|
| `fallow.tools` | Already first-class for audit, dead-code, health, and MCP-assisted analysis. Prefer Fallow before adding `knip` or `jscpd`. |
| `knip.dev`, `jscpd.dev` | Candidate only if Fallow leaves a specific dead-code or duplication gap. Do not add by default. |
| wallace | Candidate for CSS complexity reporting if styles grow beyond Tailwind/shadcn conventions. Not needed for the current small CSS surface. |
| ESLint, StyleLint, `clint` | This repo uses Biome for formatting and oxlint/tsgolint for linting. Add another linter only for a rule class those tools cannot cover. |
| Vite+ | Already on Vite with React and Tailwind plugins; upgrade only for a concrete feature or performance need. |
| `chrome-devtools-mcp`, `agent-browser`, Lightpanda | Chrome DevTools MCP and Playwright are the default UI verification stack. Evaluate alternatives only for a missing browser automation capability. |
| Context7 | Already configured as optional MCP. Use it for current library docs when implementation details depend on upstream behavior. |
| Sentry CLI, Spotlight | Good candidates if the app adopts Sentry for error monitoring. Do not add until there is a Sentry project and DSN/config plan. |
| Storybook AI | Candidate only after Storybook exists in the repo. Component discovery currently relies on source search and tests. |
| dex, beads | Task tracking tools are out of scope unless the team standardizes on them outside the repo. |
| TanStack Code Mode | Worth evaluating when changing TanStack Router or Query flows, but keep repo conventions in `CLAUDE.md` authoritative. |

**Symlinks:** After `pnpm install`, `.cursor` / `.claude` link here (see `scripts/ensure-ai-rules-symlinks.mjs`). Repair anytime: `pnpm run ai-rules:link`. On Windows: enable **Developer Mode** or run shell elevated if Git symlinks are off; `postinstall` can still create links.

**Not in repo:** `.claude/settings.local.json` (machine local).

**New machine setup:** See root `README.md` (clone → `pnpm install` → `pnpm verify`).
