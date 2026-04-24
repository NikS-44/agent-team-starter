# agent-team-starter

React + Vite + TanStack Query + Zod + Hono + SQLite, with a shared **`.ai-rules/`** tree for agents (skills, commands, agents, MCP). See `CLAUDE.md` for **definition of done** and stack rules.

## New machine (0 → 1)

1. **Install** [Node.js 20+](https://nodejs.org) and [pnpm](https://pnpm.io/installation) (`corepack enable` then `corepack prepare pnpm@latest --activate` works on many setups).
2. **Clone and install**
   ```bash
   git clone <repo-url> && cd agent-team-starter
   pnpm install
   ```
   `postinstall` runs `scripts/ensure-ai-rules-symlinks.mjs` so **`.cursor/`** and **`.claude/`** point at **`.ai-rules/`**. If symlinks are missing (some Windows checkouts), run `pnpm run ai-rules:link`.
3. **Verify the toolchain** (same gate as CI: types, tests, lint, format, build, Fallow audit)
   ```bash
   pnpm verify
   ```
4. **Run the app** — API + Vite: `pnpm dev` (or `pnpm dev:ready` to wait for ports, then `pnpm dev:stop` when done). Default UI: [http://localhost:5173](http://localhost:5173); API: [http://127.0.0.1:8787](http://127.0.0.1:8787).
5. **Optional** — [GitHub CLI](https://cli.github.com) (`gh auth login` for PRs), Chrome DevTools MCP and Context7 in Cursor (see `.ai-rules/mcp.json` and **`.ai-rules/README.md`** for `CONTEXT7_API_KEY`), and any secrets in local-only files (e.g. **`.claude/settings.local.json`**, not committed).

## AI workflow (short)

| Goal | Command |
|------|--------|
| Full pipeline (plan → critic → test critic → build → review) | In Claude Code: `/ship <spec>` |
| Smaller / fast path | `/ship-light <spec>` |
| Browser-only smoke | `/verify [path]` |

Details and tradeoffs: `.ai-rules/commands/ship.md`, `ship-light.md`, `verify.md`. Layout of skills/rules: **`.ai-rules/README.md`**.
