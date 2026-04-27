---
name: ui-explore
description: >-
  Generate 4–5 distinct UI layouts for the same feature and data model, implement
  each as a demo component, screenshot with Chrome DevTools MCP, and present a
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

### File locations

```
src/pages/ui-explore/<feature-name>/
  index.tsx          ← wrapper page; renders all variants with a tab or toggle switcher
  TableVariant.tsx
  CardGridVariant.tsx
  TimelineVariant.tsx
  KanbanVariant.tsx
  DashboardVariant.tsx
```

Or, if a single file is cleaner (few variants, simple layouts):

```
src/pages/ui-explore/<feature-name>.tsx
```

### Implementation rules

- Use the same mock data object / array for every variant — define it once at the top of `index.tsx` and pass as a prop.
- Use only existing shared components (`src/components/ui/`) — **do not install new UI libraries** for exploration.
- Keep each variant self-contained and independently renderable.
- Add a route for the exploration page (e.g. `/ui-explore/<feature-name>`) using the `route` skill so it's accessible in the browser.
- No tests needed for exploration components — they are throwaway scaffolding.
- Mark the route and components with a `// UI EXPLORE: remove before ship` comment.

### Mock data conventions

- Use a typed constant: `const MOCK_<FEATURE>: <Type>[] = [...]`
- Include at least 6–8 records covering edge cases: long text, missing optional fields, extreme values, different statuses.
- Mirror the shape of the real Zod schema so swapping in a TanStack Query hook later is trivial.

---

## Step 4 — Screenshot each variant

Start the dev server, navigate to the exploration route, and capture each variant.

1. `pnpm dev:ready` — note Vite URL.
2. `navigate_page` to `/ui-explore/<feature-name>`.
3. For **each variant**:
   - Switch to the variant (click the tab/toggle in the wrapper page).
   - `take_snapshot`.
   - `take_screenshot` → `verification/<branch>/ui-explore-<feature>-<variant>.png` (`fullPage: true`).
   - Note 2–3 observations per variant (what this layout emphasises, what it hides).
4. Optionally, for variants with interactions (e.g. Kanban drag, Table sort):
   - `take_screenshot` before → interact → `take_screenshot` after. Use `before`/`after` naming.

---

## Step 5 — Present comparison

Produce a structured comparison the team can react to.

```markdown
## UI Exploration — <feature name>

**Data shape:** <summary of fields used>
**Primary action:** <the task each variant must support>
**Branch:** <branch name>

### Variants

#### 1. Table View
![table](verification/<branch>/ui-explore-<feature>-table.png)

**Strengths:** Dense, sortable, familiar for data-heavy workflows.  
**Weaknesses:** No visual scanning; status is easy to miss.  
**Best for:** Power users who know what they're looking for.

#### 2. Card Grid
![cards](verification/<branch>/ui-explore-<feature>-cards.png)

**Strengths:** Status and key metadata visible at a glance.  
**Weaknesses:** Lower information density; pagination required sooner.  
**Best for:** Moderate record counts; scanning by visual cue.

#### 3. Timeline / Feed
...

#### 4. Kanban Board
...

#### 5. Stat Dashboard
...

### Comparison Table

| Criterion | Table | Card Grid | Timeline | Kanban | Dashboard |
|-----------|-------|-----------|----------|--------|-----------|
| Information density | ★★★★★ | ★★★☆☆ | ★★☆☆☆ | ★★★☆☆ | ★★★★☆ |
| Scannability | ★★☆☆☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ |
| Primary action support | ★★★★☆ | ★★★☆☆ | ★★☆☆☆ | ★★★★★ | ★★☆☆☆ |
| Mobile-friendliness | ★★☆☆☆ | ★★★★☆ | ★★★★★ | ★★☆☆☆ | ★★★☆☆ |
| Implementation complexity | Low | Low | Medium | High | High |

### Recommendation
<Suggested variant and rationale, or "ask the team to pick" if genuinely even>

### Next steps
- [ ] Team picks a variant (or hybrid).
- [ ] Remove `// UI EXPLORE` components and route.
- [ ] Implement chosen variant with real data hook and tests (see `strict-tdd`).
- [ ] Run `ux-critique` on the final implementation before ship.
```

---

## Cleanup

After the team picks a direction:

1. Delete `src/pages/ui-explore/<feature-name>/` (or the exploration file).
2. Remove the exploration route from the router.
3. Implement the chosen variant in its proper location with a real TanStack Query hook.
4. Run `/ship` to implement, test, and verify.
5. Run `ux-critique` on the final result if UX quality needs a second pass before merge.

---

## Checklist

- [ ] Feature, data shape, primary action, and user defined
- [ ] 4–5 genuinely distinct archetypes chosen (not near-duplicates)
- [ ] Same typed mock data used across all variants
- [ ] Route added; dev server confirms it renders
- [ ] Screenshot for each variant saved to `verification/<branch>/ui-explore-<feature>-<variant>.png`
- [ ] Comparison table with strengths/weaknesses for each variant
- [ ] Recommendation or explicit "team decides" call made
- [ ] Cleanup plan noted (exploration components are not shipped)
