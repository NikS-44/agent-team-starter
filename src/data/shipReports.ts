import type { ShipReport } from "./shipReportsTypes";

/**
 * In-app “what we shipped” narratives. To add a run: put PNGs under
 * `public/ship-reports/<slug>/`, then append a new object here.
 */
export const SHIP_REPORTS: ShipReport[] = [
  {
    id: "sortable-design-system",
    menuLabel: "Sortable → design system",
    title: "Sortable list moved into the component library",
    summary: [
      "The dnd-kit vertical list demo no longer lives only on Playground. It is implemented as `SortableListDemo` and embedded in the design system under **Sortable list**, with a jump-nav entry and deep link `#sortable`.",
      "Playground now shows a short card that links to `/components-demo#sortable` so the component library is the source of truth for the pattern, while Playground remains for other spikes.",
    ],
    prUrl: "https://github.com/NikS-44/agent-team-starter/pull/7",
    images: [
      {
        src: "/ship-reports/sortable-design-system/components-demo-sortable.png",
        alt: "Component library with the Sortable section visible",
        caption: "Sortable section on `/components-demo#sortable`",
      },
      {
        src: "/ship-reports/sortable-design-system/playground-cta.png",
        alt: "Playground page with a button linking to the design system",
        caption: "Playground CTA — opens the design system in a new context",
      },
      {
        src: "/ship-reports/sortable-design-system/ship-report.png",
        alt: "Previous ship verification checklist page",
        caption: "Earlier `/ship-report` (checklist) before this documentation view",
      },
    ],
    reprompts: [
      {
        id: "a11y",
        label: "Accessibility & keyboard",
        description:
          "Tighten focus, aria, and sortable drag affordances without changing product behavior.",
        prompt:
          "In the agent-team-starter repo, review `src/components/SortableListDemo.tsx` and the sortable `DemoSection` in `AllComponentsShowcase`. List any accessibility issues (focus order, live regions, keyboard sorting) and suggest minimal code-level fixes. Do not refactor unrelated code.",
      },
      {
        id: "public-assets",
        label: "How ship screenshots are served",
        description: "Rethink keeping screenshots under public vs. importing as modules.",
        prompt:
          "In agent-team-starter, ship report images live under `public/ship-reports/...`. Compare that to colocating assets under `src/assets` with Vite imports. Recommend one pattern for a small team and why — one paragraph, then 3 bullet tradeoffs maximum.",
      },
    ],
  },
  {
    id: "next-template",
    menuLabel: "Next ship (empty template)",
    title: "Add your next ship run here",
    summary: [
      "Duplicate an entry in `src/data/shipReports.ts` and add PNGs to `public/ship-reports/<your-slug>/` (same filenames in data as on disk).",
      "This placeholder has no images so the gallery is hidden; reprompts are examples you can delete or replace.",
    ],
    images: [],
    reprompts: [
      {
        id: "fallow",
        label: "Fallow audit of last change",
        description: "Use when you want a second pass on complexity or dead code after a big PR.",
        prompt:
          "In agent-team-starter, describe how `pnpm fallow audit` is meant to be used from CLAUDE.md, then list what you would run after merging a feature that touched `AllComponentsShowcase.tsx` and why.",
      },
    ],
  },
];

export const DEFAULT_SHIP_REPORT_ID = SHIP_REPORTS[0]?.id ?? "sortable-design-system";
