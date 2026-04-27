---
name: ui-explore
description: >-
  Generate 4–5 distinct UI layouts for the same feature and data model, implement
  each as a demo component, screenshot with Chrome DevTools MCP, run one UX
  critique round on those images, apply one iteration of fixes, then present a
  side-by-side comparison so the team can choose a direction.
---

# UI Explore

**Purpose:** When a feature's UI direction is unclear, generate multiple distinct visual approaches — all backed by the same data and route — so the team can evaluate trade-offs visually before committing to a design.

**When to use:**
- Starting a new feature and want to see layout options before building.
- Redesigning an existing view and unsure which layout fits best.
- Stakeholder or designer input is unavailable; need something concrete to react to.

**Requires:** Chrome DevTools MCP connected. Run `list_pages` to confirm.

---

## Step 1 — Define the feature and data

Before generating variants, establish:

```
Feature: <what the user is trying to do, e.g. "browse and filter a list of invoices">
Data shape: <key fields and their types, e.g. id, amount, status, date, client>
Primary action: <the one thing the user most needs to do, e.g. "find an overdue invoice">
User: <who uses this, e.g. "ops manager, desktop, data-dense workflows">
Constraints: <any hard limits, e.g. "must work on 1280px+", "no new deps">
```

If this isn't given, read the relevant Zod schema and TanStack Query hook, then derive it from the data shape in the codebase.

---

## Step 2 — Propose 4–5 layout archetypes

Pick distinct visual metaphors — avoid near-duplicates. Standard archetypes to consider:

| Archetype | Character | Best for |
|-----------|-----------|----------|
| **Data Table** | Dense rows, sortable columns, inline actions | Power users; many records; comparing values |
| **Card Grid** | Visual tiles, scannable at a glance | Items with images or statuses; moderate record counts |
| **Timeline / Feed** | Chronological vertical stream | Activity logs, history, events |
| **Kanban / Board** | Status columns with draggable cards | Workflow state; items that move through stages |
| **Stat Dashboard** | KPI tiles + sparklines + summary table | Executive or monitoring view; metric-centric |
| **Split Panel** | List on left, detail on right | Navigation-heavy; detail-rich items |
| **Gallery / Masonry** | Variable-height tiles | Media-heavy or richly varied content |
| **Command / Omnibox** | Search-first, results below | Power users; large datasets; keyboard-centric |

Select 4–5 that are genuinely distinct for the feature. Name each variant clearly (e.g. `TableVariant`, `CardGridVariant`).

---

## Step 3 — Implement demo components

Create lightweight prototype components. Use real or realistic mock data — not "Lorem ipsum."

```
src/pages/ui-explore/<feature-name>/
  index.tsx          ← wrapper page; renders all variants with a tab or toggle switcher
  TableVariant.tsx
  CardGridVariant.tsx
  ...
```

- Define mock data once at the top of `index.tsx` and pass as a prop to every variant. Use a typed constant (`const MOCK_<FEATURE>: <Type>[] = [...]`) with 6–8 records covering edge cases (long text, missing optional fields, extreme values, different statuses). Mirror the real Zod schema shape so swapping in a TanStack Query hook later is trivial.
- Use only existing shared components (`src/components/ui/`) — **do not install new UI libraries**.
- Add a route (e.g. `/ui-explore/<feature-name>`) via the `route` skill and mark it `// UI EXPLORE: remove before ship`.
- No tests needed — these are throwaway scaffolding.

---

## Step 4 — Screenshot each variant

1. `pnpm dev:ready` — note Vite URL.
2. `navigate_page` to `/ui-explore/<feature-name>`.
3. For **each variant**: switch to it, `take_snapshot`, `take_screenshot` → `verification/<branch>/ui-explore-<feature>-<variant>.png` (`fullPage: true`). Note 2–3 observations (what this layout emphasises, what it hides).
4. For variants with interactions (Kanban drag, Table sort): **before** screenshot → interact → **after** screenshot with `before`/`after` naming.

---

## Step 5 — UX critique (one round)

After screenshots exist under `verification/<branch-or-slug>/…`, run **exactly one** structured critique pass **before** writing the comparison article.

1. Read the **`ux-critique`** skill. Default to **Mode 1: Heuristic sweep** on the exploration route (`/ui-explore/<feature-name>`). Use **Full audit** only if the exploration includes multi-step flows worth walking as a persona.
2. Use the PNGs from Step 4 as primary evidence (re-open in the browser with `navigate_page` when live state helps).
3. Produce a **findings table** with: **severity** (low / medium / high), **heuristic** (H1–H10), **finding**, **affected variant(s)**, and **evidence** (screenshot path or snapshot note).
4. Save the write-up to `verification/<branch-or-slug>/ui-explore-<feature>-ux-findings.md` (flatten `/` in branch names for the folder, e.g. `nik/feature` → `verification/nik-feature/`).
5. **Stop after this round** — do not loop critique passes unless the user explicitly asks for another.

---

## Step 6 — One iteration on variants

Address **every medium and high** finding with **one** batch of UI changes in the exploration components (copy, contrast, focus, hierarchy, removing misleading chrome). **Low** findings are optional but should be fixed when the change is trivial.

- Re-screenshot variants **only** where the visual delta matters for the team decision; otherwise note “verified in browser” in the comparison.
- **Out of scope:** new layout variants, new dependencies, or shipping exploration code to production.

---

## Step 7 — Present comparison

```markdown
## UI Exploration — <feature name>

**Data shape:** <summary of fields used>
**Primary action:** <the task each variant must support>

### Variants

#### 1. <Variant name>
![variant](verification/<branch>/ui-explore-<feature>-<variant>.png)

**Strengths:** ...
**Weaknesses:** ...
**Best for:** ...

#### 2. ...

### Recommendation
<Suggested variant and rationale, or "ask the team to pick" if genuinely even>

### Next steps
- [ ] Team picks a variant (or hybrid).
- [ ] Remove `// UI EXPLORE` components and route.
- [ ] Implement chosen variant with real data hook and tests (see `strict-tdd`).
- [ ] Run `ux-critique` again on the **shipped** implementation before merge if UX quality needs a final pass (exploration critique in Step 5 is not a substitute for production QA).
```

---

## Cleanup

Delete `src/pages/ui-explore/<feature-name>/`, remove the route, implement the chosen variant in its proper location with a real TanStack Query hook, then run `/ship`.

## Checklist

- [ ] One `ux-critique` round completed; findings saved to `verification/<branch-slug>/ui-explore-<feature>-ux-findings.md`
- [ ] One iteration applied; medium+ findings addressed (or documented as wont-fix)
- [ ] Recommendation made (or explicit "team decides")
