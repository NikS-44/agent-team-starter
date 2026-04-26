/**
 * Parse minimal LCOV (per file, DA: lines) for V8 / Vitest output.
 */
export type LcovLineHits = {
  /** Normalized repo-relative path (forward slashes) */
  filePath: string;
  /** line (1-based) -> hit count; line omitted if not instrumented in report */
  da: Map<number, number>;
};

function parseDaLine(l: string): { line: number; hits: number } | null {
  if (!l.startsWith("DA:")) {
    return null;
  }
  const rest = l.slice(3);
  const idx = rest.lastIndexOf(",");
  if (idx < 0) {
    return null;
  }
  const lineStr = rest.slice(0, idx);
  const hitStr = rest.slice(idx + 1);
  const lineNo = Number.parseInt(lineStr, 10);
  const hits = Number.parseInt(hitStr, 10);
  if (Number.isNaN(lineNo) || Number.isNaN(hits)) {
    return null;
  }
  return { line: lineNo, hits };
}

function daMapFromLines(lines: readonly string[]): Map<number, number> {
  const da = new Map<number, number>();
  for (const l of lines) {
    const p = parseDaLine(l);
    if (p) {
      da.set(p.line, p.hits);
    }
  }
  return da;
}

export function parseLcov(
  lcov: string,
  normalizePath: (sf: string) => string
): Map<string, LcovLineHits> {
  const byFile = new Map<string, LcovLineHits>();
  const blocks = lcov.split("end_of_record");
  for (const block of blocks) {
    const lines = block.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) {
      continue;
    }
    const sf = lines.find((l) => l.startsWith("SF:"));
    if (!sf) {
      continue;
    }
    const rawPath = sf.slice(3);
    const filePath = normalizePath(rawPath);
    if (!filePath) {
      continue;
    }
    const da = daMapFromLines(lines);
    if (da.size > 0) {
      byFile.set(filePath, { filePath, da });
    }
  }
  return byFile;
}
