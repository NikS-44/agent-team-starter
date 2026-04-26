import { isClientCoverageSourceFile } from "../../src/coverage/coverageScope";
import type { LcovLineHits } from "./parseLcov";

type UncoveredLine = { file: string; line: number };

export type PatchCoverageResult = {
  /**
   * In-scope diff lines that V8 **instrumented** (present in lcov `DA` for the file).
   * Comments, blanks, and other non-executable lines are **excluded** so they
   * do not dilute the rate or trigger check spam.
   */
  total: number;
  /** Subset of total with at least one hit in lcov */
  covered: number;
  /** Instrumented diff lines with 0 runs (candidates for more tests) */
  uncovered: UncoveredLine[];
  perFile: { file: string; total: number; covered: number }[];
};

type DiffLineKind = "skip" | "covered" | "miss";

/**
 * A diff line with no lcov `DA` row is not counted (comments, blanks, some imports, etc.).
 */
function kindForDiffLine(
  lcov: Map<string, LcovLineHits>,
  file: string,
  line: number
): DiffLineKind {
  const rec = lcov.get(file);
  if (!rec?.da.has(line)) {
    return "skip";
  }
  return (rec.da.get(line) ?? 0) > 0 ? "covered" : "miss";
}

function tallyOneFile(
  file: string,
  lineList: number[],
  lcov: Map<string, LcovLineHits>
): { inst: number; hit: number; missed: UncoveredLine[] } {
  let inst = 0;
  let hit = 0;
  const missed: UncoveredLine[] = [];
  for (const line of lineList) {
    const k = kindForDiffLine(lcov, file, line);
    if (k === "skip") {
      continue;
    }
    inst += 1;
    if (k === "covered") {
      hit += 1;
    } else {
      missed.push({ file, line });
    }
  }
  return { inst, hit, missed };
}

/**
 * @param lcov - output of parseLcov
 * @param additions - file -> new line numbers from `parseGitDiffAdditions` (unfiltered)
 */
export function computePatchCoverage(
  lcov: Map<string, LcovLineHits>,
  additions: Map<string, number[]>,
  filterPath: (relPath: string) => boolean = isClientCoverageSourceFile
): PatchCoverageResult {
  const perFile: { file: string; total: number; covered: number }[] = [];
  const uncovered: UncoveredLine[] = [];
  let total = 0;
  let covered = 0;

  for (const [file, lineList] of additions) {
    if (!filterPath(file)) {
      continue;
    }
    const { inst, hit, missed } = tallyOneFile(file, lineList, lcov);
    total += inst;
    covered += hit;
    uncovered.push(...missed);
    if (inst > 0) {
      perFile.push({ file, total: inst, covered: hit });
    }
  }
  perFile.sort((a, b) => a.file.localeCompare(b.file));

  return { total, covered, uncovered, perFile };
}

export function patchCoveragePercent(result: PatchCoverageResult): number | null {
  if (result.total === 0) {
    return null;
  }
  return (100 * result.covered) / result.total;
}
