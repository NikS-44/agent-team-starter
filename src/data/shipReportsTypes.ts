type ShipReportImage = {
  src: string;
  alt: string;
  caption: string;
};

type ShipReportReprompt = {
  id: string;
  label: string;
  description: string;
  prompt: string;
};

/** Full-page before/after captures (committed under `public/screenshots/`). */
export type ShipReportBranchEvidence = {
  /** Shown above the baseline screenshot (e.g. `main` at merge-base). */
  baseLabel: string;
  /** Shown above the feature screenshot (e.g. your branch). */
  headLabel: string;
  /** Public URL, e.g. `/screenshots/my-feature/before.png` */
  beforeSrc: string;
  /** Public URL for the “after” full-page capture */
  afterSrc: string;
};

export type ShipReport = {
  id: string;
  /** Short text for the report dropdown */
  menuLabel: string;
  title: string;
  summary: string[];
  prUrl?: string;
  images: ShipReportImage[];
  reprompts: ShipReportReprompt[];
  /** Large baseline vs branch screenshots (image-only evidence) */
  branchEvidence?: ShipReportBranchEvidence;
};
