type VerificationAssetInput = {
  path: string;
  url?: string;
  text?: string;
};

type LocalVerificationImage = {
  name: string;
  caption: string;
  src: string;
  path: string;
};

type LocalVerificationArtifact = {
  name: string;
  path: string;
  preview: string;
};

export type LocalVerificationReport = {
  id: string;
  title: string;
  summary?: string;
  createdAt?: string;
  images: LocalVerificationImage[];
  artifacts: LocalVerificationArtifact[];
};

type MutableReport = LocalVerificationReport & {
  sortTime: number;
};

function titleFromSlug(value: string) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function captionFromFileName(value: string) {
  return titleFromSlug(value.replace(/\.[^.]+$/, "").replace(/^\d+-/, ""));
}

function verificationParts(path: string) {
  const normalized = path.split("\\").join("/");
  const marker = "/verification/";
  const markerIndex = normalized.indexOf(marker);
  const relative = markerIndex >= 0 ? normalized.slice(markerIndex + marker.length) : normalized;
  const [slug, ...rest] = relative.split("/");
  const fileName = rest[rest.length - 1];

  if (!slug || !fileName || rest.length === 0) return null;

  return {
    slug,
    fileName,
    relativePath: `verification/${slug}/${rest.join("/")}`,
  };
}

function reportFromMetadata(text: string) {
  try {
    const parsed = JSON.parse(text) as { createdAt?: unknown; summary?: unknown; title?: unknown };
    return {
      createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : undefined,
      title: typeof parsed.title === "string" ? parsed.title : undefined,
      summary: typeof parsed.summary === "string" ? parsed.summary : undefined,
    };
  } catch {
    return {};
  }
}

function getOrCreateReport(reports: Map<string, MutableReport>, slug: string) {
  const existing = reports.get(slug);
  if (existing) return existing;

  const report: MutableReport = {
    id: slug,
    sortTime: Number.NEGATIVE_INFINITY,
    title: titleFromSlug(slug),
    images: [],
    artifacts: [],
  };
  reports.set(slug, report);
  return report;
}

function applyMetadata(report: MutableReport, text: string) {
  const metadata = reportFromMetadata(text);
  report.title = metadata.title ?? report.title;
  report.summary = metadata.summary ?? report.summary;
  report.createdAt = metadata.createdAt ?? report.createdAt;
  if (metadata.createdAt) {
    const parsedTime = Date.parse(metadata.createdAt);
    report.sortTime = Number.isNaN(parsedTime) ? report.sortTime : parsedTime;
  }
}

function addAssetToReport(
  report: MutableReport,
  asset: VerificationAssetInput,
  parts: NonNullable<ReturnType<typeof verificationParts>>
) {
  if (parts.fileName === "report.json" && asset.text) {
    applyMetadata(report, asset.text);
    return;
  }

  if (asset.url) {
    report.images.push({
      name: parts.fileName,
      caption: captionFromFileName(parts.fileName),
      src: asset.url,
      path: parts.relativePath,
    });
    return;
  }

  if (asset.text) {
    report.artifacts.push({
      name: parts.fileName,
      path: parts.relativePath,
      preview: asset.text.split(/\r?\n/).slice(0, 2).join("\n"),
    });
  }
}

function finalizeReport({
  sortTime: _sortTime,
  ...report
}: MutableReport): LocalVerificationReport {
  return {
    ...report,
    images: report.images.sort((a, b) => a.name.localeCompare(b.name)),
    artifacts: report.artifacts.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

export function buildLocalVerificationReports(
  assets: VerificationAssetInput[]
): LocalVerificationReport[] {
  const reports = new Map<string, MutableReport>();

  for (const asset of assets) {
    const parts = verificationParts(asset.path);
    if (!parts) continue;

    addAssetToReport(getOrCreateReport(reports, parts.slug), asset, parts);
  }

  return [...reports.values()]
    .sort((a, b) => b.sortTime - a.sortTime || a.id.localeCompare(b.id))
    .map(finalizeReport);
}

const imageModules = import.meta.glob("../../verification/**/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const textModules = import.meta.glob("../../verification/**/*.{txt,md,json}", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

export const LOCAL_VERIFICATION_REPORTS = buildLocalVerificationReports([
  ...Object.entries(imageModules).map(([path, url]) => ({ path, url })),
  ...Object.entries(textModules).map(([path, text]) => ({ path, text })),
]);
