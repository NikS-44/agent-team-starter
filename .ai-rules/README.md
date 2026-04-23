# Shared AI configuration (`.ai-rules/`)

Everything here is the **only** copy committed to the repo. **Do not** duplicate these files under `.cursor/` or `.claude/`.

| Path | Role |
|------|------|
| `rules/defaults.mdc` | Always-on Cursor/Claude rule: points at `CLAUDE.md` and this layout. |
| `skills/<name>/SKILL.md` | Agent skills (e.g. **chrome-devtools-verify**, **drizzle-db-verify**). |
| `commands/*.md` | Slash commands (`/ship`, `/ship-light`, `/verify`, …). |
| `agents/*.md` | Claude pipeline agents. |
| `mcp.json` | MCP config for the repo; memory still uses **`.cursor/mcp-memory.jsonl`** (gitignored). |

## Tool entrypoints (symlinks)

After **`pnpm install`**, `postinstall` runs `scripts/ensure-ai-rules-symlinks.mjs` to create:

- **`.cursor/skills`**, **`.cursor/commands`**, **`.cursor/rules`** → same-named dirs under **`.ai-rules/`**
- **`.cursor/mcp.json`** → **`.ai-rules/mcp.json`**
- **`.claude/skills`**, **`.claude/commands`**, **`.claude/rules`**, **`.claude/agents`** → same under **`.ai-rules/`** (except **agents** exist only in `.ai-rules/`; Claude’s path is a link to that folder).

On **macOS / Linux**, Git can also store these symlinks directly—either way, **`pnpm run ai-rules:link`** repairs or creates them. On **Windows**, turn on **Developer Mode** (or run your shell as admin) and use `git config core.symlinks true`, or rely on `postinstall` after `pnpm i`.

**Not shared:** **`.claude/settings.local.json`** (machine-only; stays next to `.claude`).
