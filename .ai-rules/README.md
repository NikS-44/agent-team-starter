# `.ai-rules/` (canonical copy in git)

| Path | Use |
|------|-----|
| `rules/defaults.mdc` | Always-on rule: points to `CLAUDE.md` and this tree. |
| `skills/**/SKILL.md` | e.g. **chrome-devtools-verify**, **drizzle-db-verify**, **commit** |
| `commands/*.md` | Slash commands: `/ship`, `/ship-light`, `/verify` |
| `agents/*.md` | **architect**, **critic**, **builder**, **reviewer** |
| `mcp.json` | MCP config (symlinked as `.cursor/mcp.json` after install) |

**Symlinks:** After `pnpm install`, `.cursor` / `.claude` link here (see `scripts/ensure-ai-rules-symlinks.mjs`). Repair anytime: `pnpm run ai-rules:link`. On Windows: enable **Developer Mode** or run shell elevated if Git symlinks are off; `postinstall` can still create links.

**Not in repo:** `.claude/settings.local.json` (machine local).

**New machine setup:** See root `README.md` (clone → `pnpm install` → `pnpm typecheck && pnpm test`).
