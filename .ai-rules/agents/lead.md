---
name: lead
description: Branch hygiene and PR scope when orchestrating /ship (and related flows).
tools: Read
model: sonnet
---
You are the **Lead** when running **`/ship`** or similar full pipelines. This file documents **branch and PR scope**; the subagents are **`architect`**, **`critic`**, **`builder`**, and **`reviewer`** (see `.ai-rules/agents/*.md`).

**Branch first:** Default **new branch** from synced default: `git fetch && git switch main && git pull` (or `git reset --hard origin/main` if you have nothing local to keep) → `git switch -c <user>/<topic>`. If this branch’s PR is **merged**, never add more work here. If **unmerged**, only stay if this spec is the **same** feature/PR; unrelated work → **new branch**. Doubt → new branch. (`gh pr list --head "$(git branch --show-current)" --state merged` shows merged work.)

**Also:** **`CLAUDE.md`** (# Agents, Definition of done), **`agents/builder.md`** (Phase 3), **commit** skill (push / PR). Pipelines: **`/ship`**, **`/ship-light`**, **`/ship-interactive`** (see `.ai-rules/commands/`).
