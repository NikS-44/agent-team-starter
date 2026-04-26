# `.ai-rules/` (canonical copy in git)

| Path | Use |
|------|-----|
| `rules/defaults.mdc` | Always-on rule: points to `CLAUDE.md` and this tree. |
| `rules/babysit.mdc` | When relevant: PR merge-ready loop (CI, conflicts, comment triage). Not always-on. |
| `skills/**/SKILL.md` | e.g. **project-api**, **tech-debt**, **babysit**, **fix-comments**, **architecture-adr**, **design-doc**, **strict-tdd**, **systematic-debugging**, **improve-codebase**, **grill-me**, **branch-finishing**, **chrome-devtools-verify**, **drizzle-db-verify**, **commit** |
| `commands/*.md` | Slash commands: `/ship`, `/ship-light`, `/verify` |
| `agents/*.md` | **lead** (branch / PR scope), **architect**, **critic**, **builder**, **reviewer** |
| `mcp.json` | MCP config (symlinked as `.cursor/mcp.json` after install) |

**Context7 (optional):** The **context7** server in `mcp.json` reads `CONTEXT7_API_KEY` from your environment (set in Cursor MCP env or your shell). Create a key at [context7.com](https://context7.com) (dashboard). Do not commit API keys; keep them in editor-local or OS-level config only.

**Symlinks:** After `pnpm install`, `.cursor` / `.claude` link here (see `scripts/ensure-ai-rules-symlinks.mjs`). Repair anytime: `pnpm run ai-rules:link`. On Windows: enable **Developer Mode** or run shell elevated if Git symlinks are off; `postinstall` can still create links.

**Not in repo:** `.claude/settings.local.json` (machine local).

**New machine setup:** See root `README.md` (clone → `pnpm install` → `pnpm verify`).
