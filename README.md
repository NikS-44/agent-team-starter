# agent-team-starter

Scaffolding for a Claude Code agent-team workflow targeting a React + Zustand + TanStack Query + Zod stack, with Chrome DevTools MCP verification.

## Quick start

1. Install deps: `pnpm install`
2. Install Chrome DevTools MCP: `claude mcp add chrome-devtools -s user -- npx chrome-devtools-mcp@latest`
3. Ship a feature: `claude` then `/ship <feature description>` (full pipeline), or `/ship-light <feature description>` for a faster path with fewer subagents (see command file for tradeoffs)
4. Verify current branch: `/verify [path]`

## Architecture

- `CLAUDE.md` — shared definition of done and stack conventions
- `.ai-rules/` — only committed copy: **skills**, **rules** (`defaults.mdc`), **commands**, **agents**, **mcp**; see `.ai-rules/README.md`
- `.cursor/*` and `.claude/*` (except local settings) — **symlinks** into `.ai-rules/`; recreated on **`pnpm i`** via `postinstall` if your Git checkout omits them
- `scripts/dev-ready.sh` + `scripts/dev-stop.sh` — background dev server lifecycle
