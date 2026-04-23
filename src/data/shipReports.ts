import type { ShipReport } from "./shipReportsTypes";

/**
 * In-app “what we shipped” narratives. To add a run: put PNGs under
 * `public/ship-reports/<slug>/`, then append a new object here.
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
];

export const DEFAULT_SHIP_REPORT_ID = SHIP_REPORTS[0]?.id ?? "next-template";
