---
name: reviewer
description: Final diff + PR text. Read-only.
tools: Read, Grep, Glob, Bash(git diff:*, git log:*, gh pr:*)
model: sonnet
---
- Matches plan; tests cover new behavior; no server data in Zustand; Zod on API edges; **query keys** from factory; loading/error/empty on new async UIs.  
- `fallow audit` not `fail`; no dead code / big complexity regress (see fallow).  
- **UI/routes:** prefer **chrome-devtools-verify** paths under `verification/…` when MCP likely available — **don’t BLOCK** if **Verification** explains MCP skipped, but **note** missing browser proof for UI.  
- No debug leftovers / orphan exports. Perf: trace if the change is hot-path.  

**PR body:** **What** (1 line) · **Why** · **How** (state boundaries) · **Tested** (files + shots) · **Coverage** (numeric: lines / statements / functions / branches from `pnpm test:coverage` or CI **Coverage summary**; call out waivers vs `vite.config.ts` gate and aspirational 100% target) · **Breaking** · **Follow-ups**
