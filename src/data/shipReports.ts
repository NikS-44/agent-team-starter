import type { ShipReport } from "./shipReportsTypes";

/**
 * In-app “what we shipped” narratives.
 *
 * - Gallery images: `public/ship-reports/<slug>/` + `images[]` here.
 * - **Master vs branch** evidence: `public/screenshots/<slug>/` (`before` / `after` captures) +
 *   `branchEvidence` below.
 */
export const SHIP_REPORTS: ShipReport[] = [
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
  {
    id: "local-evidence-template",
    menuLabel: "Local evidence (template)",
    title: "Branch vs main + committed screenshots",
    summary: [
      "This entry demonstrates **branchEvidence**: large **before** (baseline) and **after** (feature) images under `public/screenshots/local-evidence-template/`. The visual delta is the review surface—no committed patch file.",
      "Replace the SVG placeholders with real **before.png** / **after.png** full-page captures (same URL and viewport); update `beforeSrc` / `afterSrc` in `shipReports.ts` when you switch to PNG.",
    ],
    branchEvidence: {
      baseLabel: "Baseline (example: main)",
      headLabel: "Feature branch (current work)",
      beforeSrc: "/screenshots/local-evidence-template/before.svg",
      afterSrc: "/screenshots/local-evidence-template/after.svg",
    },
    images: [],
    reprompts: [],
  },
];

export const DEFAULT_SHIP_REPORT_ID = SHIP_REPORTS[0]?.id ?? "next-template";
