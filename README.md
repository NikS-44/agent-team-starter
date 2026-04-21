# agent-team-starter

Scaffolding for a Claude Code agent-team workflow targeting a React + Zustand + TanStack Query + Zod stack, with Chrome DevTools MCP verification.

## Quick start

1. Install deps: `pnpm install`
2. Install Chrome DevTools MCP: `claude mcp add chrome-devtools -s user -- npx chrome-devtools-mcp@latest`
3. Ship a feature: `claude` then `/ship <feature description>`
4. Verify current branch: `/verify [path]`

## Architecture

- `CLAUDE.md` — shared definition of done and stack conventions
- `.claude/agents/` — architect, critic, builder, reviewer
- `.claude/commands/` — `/ship` and `/verify`
- `scripts/dev-ready.sh` + `scripts/dev-stop.sh` — background dev server lifecycle
