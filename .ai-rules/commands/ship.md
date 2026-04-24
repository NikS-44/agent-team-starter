---
description: Run the full plan→test→build→review pipeline
---
Feature spec: $ARGUMENTS

You are the **Lead**. **Branch and PR scope:** `.ai-rules/agents/lead.md` (and the other agent briefs under `.ai-rules/agents/` for `architect` → `critic` → `builder` → `reviewer`).

**UI + Chrome MCP:** For UI/routing changes, **chrome-devtools-verify** when MCP works; if not, document in **Verification** — not an automatic `reviewer` **BLOCK** if explained.

0. **Branch** — `.ai-rules/agents/lead.md`.

1. `architect` → plan.  
2. `critic` on plan — BLOCK? refine (max 2 rounds, then escalate).  
3. `builder` Phase 1 — tests only.  
4. `critic` on tests — same loop.  
5. `builder` Phase 2–3: implement, fallow, DevTools (UI, MCP up), **drizzle-db-verify** if db/server/migrations, screenshots `verification/…` for step 9.  
6. **Lead:** Confirm verification when MCP + UI; `/ship-report` if nav/ship in scope; PR blurb. No MCP → note in **Verification**.  
7. `pnpm fallow audit --format json` — `fail` → one builder round.  
8. `reviewer` — BLOCK? one small fix round.  
9. **Commit / push / PR** — `gh pr create` with report + `verification/…` paths, or `gh pr view` if **open** same-scope PR. UI + images on disk: `scripts/pr-comment-verify-gist.sh` once with all images. No screenshots → still describe in **Verification**. Backend-only → no gist.  
10. Escalation / budget exceeded → stop, summarize.
