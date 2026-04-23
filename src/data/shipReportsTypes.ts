export type ShipReportImage = {
  src: string;
  alt: string;
  caption: string;
};

export type ShipReportReprompt = {
  id: string;
  label: string;
  description: string;
  prompt: string;
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
};
