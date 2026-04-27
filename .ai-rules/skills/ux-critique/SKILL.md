---
name: ux-critique
description: >-
  Critique the app's UX/UI using Chrome DevTools MCP: persona-based task flows,
  Nielsen heuristic sweeps, WCAG accessibility spot-checks, and error injection.
  Produces structured findings with severity + screenshot evidence.
---

# UX Critique

**Purpose:** Identify usability, accessibility, and interaction friction using Chrome DevTools MCP and screenshots evaluated against established heuristics. Complements `chrome-devtools-verify` (shipping correctness) — this skill checks **UX quality**.

**Requires:** Chrome DevTools MCP connected. Run `list_pages` to confirm before starting.

## Modes

| Mode | Best for |
|------|----------|
| **Heuristic sweep** | Quick audit of a single page or component |
| **Persona flow** | Walk a multi-step user task end-to-end |
| **Error injection** | Verify error states are clear and recoverable |
| **Full audit** | All three modes combined |

Pick a mode from the user's request, or default to **full audit** on the primary changed route.

---

## Setup

1. `pnpm dev:ready` — note Vite URL (usually `:5173`).
2. `list_pages` — confirm MCP is connected.
3. Define **scope**: which route(s) or flow(s) to evaluate.
4. Define **persona** if running a flow (template below).

---

## Mode 1: Heuristic Sweep

1. `navigate_page` → `take_snapshot` → `take_screenshot` to `verification/<branch>/ux-<route>-01-load.png` (`fullPage: true`).
2. Screenshot each distinct state (empty, loaded, error) separately.
3. For interactive elements: **before** screenshot → interact → `take_snapshot` → **after** screenshot. Use paired names: `ux-<route>-02-before-<action>.png` / `ux-<route>-03-after-<action>.png`.
4. Evaluate each heuristic below, note evidence and severity.

### Nielsen's 10 Heuristics

| # | Heuristic | What to check |
|---|-----------|---------------|
| H1 | Visibility of system status | Loading spinners, progress bars, async feedback, skeleton screens |
| H2 | Match between system and real world | Terminology, icon clarity, mental model alignment, no jargon |
| H3 | User control and freedom | Undo, cancel, back nav, escape hatches from flows |
| H4 | Consistency and standards | Labels, layout, and interaction patterns match the rest of the app |
| H5 | Error prevention | Confirmation dialogs, input constraints, guards on destructive actions |
| H6 | Recognition over recall | Labels visible at the point of need; no cross-screen memory required |
| H7 | Flexibility and efficiency | Keyboard nav, shortcuts, power-user paths, no forced click-through |
| H8 | Aesthetic and minimalist design | Visual noise, info hierarchy, irrelevant content |
| H9 | Help users recover from errors | Error message clarity (plain language), next-step guidance, no dead ends |
| H10 | Help and documentation | Tooltips, inline help, empty-state guidance, onboarding cues |

---

## Mode 2: Persona Flow

Define the persona (ask the user if unclear; otherwise infer from context):

```
Persona: <role + technical level, e.g. "first-time user, non-technical, on a laptop">
Goal: <what they are trying to accomplish in one sentence>
Starting state: <URL, auth state, seed data if needed>
Task sequence:
  1. <natural-language step, e.g. "Find the export button and download the CSV">
  2. ...
Success criteria: <what "done" looks like>
```

For **each task step**: `take_snapshot` → **before** screenshot → `click` / `fill` / `type_text` → **after** screenshot. Log friction (confusing labels, missing affordances, unexpected state) and tag the relevant heuristic.

After the flow: `list_console_messages` (errors/warnings) and `list_network_requests` (failed or slow >2 s). Score: did the persona complete the goal? How many steps? Any dead ends?

---

## Mode 3: Error Injection

| Scenario | How to trigger |
|----------|---------------|
| Empty required form | Leave all required fields blank, submit |
| Invalid input | Malformed email, string over limit, negative number |
| Unauthorized | Access a protected resource without credentials |
| Not found | Navigate to a non-existent route (e.g. `/does-not-exist`) |

For each: **before** screenshot → trigger → `take_snapshot` → **after** screenshot. Evaluate against **H9** (recovery) and **H5** (prevention): plain-language message, clear next step, no lost work.

---

## Accessibility Spot-Check

Run automatically as part of any audit:

```
lighthouse_audit(url: <current page URL>, categories: ["accessibility"])
```

- Lighthouse a11y score ≥ 90 → pass; < 90 → flag findings.
- Color contrast ≥ 4.5:1 (normal text), ≥ 3:1 (large text/UI components).
- Interactive elements have visible focus rings; form inputs have visible labels.
- Images have `alt` text; ARIA roles used correctly; tab order is logical.

---

## Severity Levels

| Level | Definition |
|-------|-----------|
| **Critical** | Blocks task completion for any user; treat as a blocking bug |
| **Major** | Significant friction; most users will notice; fix before ship |
| **Minor** | Suboptimal; noticeable but a workaround exists |
| **Info** | Polish or future improvement; does not block ship |

---

## Output Format

```markdown
## UX Critique — <route or flow name>

**Mode:** <Heuristic sweep / Persona flow / Full audit>
**Persona:** <if applicable>
**Branch:** <branch name>

### Findings

| # | Severity | Heuristic | Finding | Evidence | Recommendation |
|---|----------|-----------|---------|----------|----------------|
| 1 | Critical | H9 | Error shows "422" with no explanation | `ux-error-empty-02-after.png` | Replace with "Please fill in your name before continuing." |
| 2 | Major | H1 | No loading indicator during form submit (2–4 s blank wait) | `ux-flow-03-after-submit.png` | Add spinner or skeleton on submit |
| 3 | Minor | H8 | "Advanced Settings" visible to all users but rarely used | `ux-01-load.png` | Collapse behind a disclosure by default |

### Persona Task Completion
- **Goal:** <goal>
- **Completed:** Yes / No / Partial
- **Steps taken:** N (expected: M)
- **Dead ends:** none / <describe>

### Accessibility
- Lighthouse a11y score: XX/100
- Blockers: <list or "none">

### Follow-ups
- [ ] Critical: <fix description> — **blocks ship**
- [ ] Major: <fix description>
- [ ] Minor: <fix description>
```

---

## Integration

| If you also need… | Use |
|-------------------|-----|
| Shipping correctness (console, network, ship-verify) | `chrome-devtools-verify` |
| Side-by-side main vs branch comparison | `verify-compare-main` |
| Multiple UI layout options before picking one | `ui-explore` |
| Fix a Critical finding with tests | `strict-tdd` |
| Document a design decision after findings | `design-doc` |

## Checklist

- [ ] Mode chosen and scope defined
- [ ] Persona defined (for flow/full mode)
- [ ] Dev server running; MCP confirmed connected
- [ ] Screenshots saved to `verification/<branch>/ux-…`
- [ ] All 10 heuristics noted (even briefly) for sweep mode
- [ ] Error injection run for any forms or auth-gated routes
- [ ] Lighthouse a11y score recorded
- [ ] Findings table complete: severity, heuristic, evidence, recommendation
- [ ] Follow-ups listed; Critical items marked as blockers
