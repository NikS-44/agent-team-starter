import { isClientCoverageSourceFile } from "../../src/coverage/coverageScope";
import type { LcovLineHits } from "./parseLcov";

type UncoveredLine = { file: string; line: number };

export type PatchCoverageResult = {
  /** In-scope (client coverage) changed lines */
  total: number;
  /** Subset of total with hit count > 0 in lcov */
  covered: number;
  /** Uncovered: hit === 0 or not reported for that line in lcov (not executed) */
  uncovered: UncoveredLine[];
  perFile: { file: string; total: number; covered: number }[];
};

function lineIsCovered(lcov: Map<string, LcovLineHits>, file: string, line: number): boolean {
  const rec = lcov.get(file);
  if (!rec) {
    return false;
  }
  return (rec.da.get(line) ?? 0) > 0;
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
    let ft = 0;
    let fc = 0;
    for (const line of lineList) {
      total += 1;
      ft += 1;
      if (lineIsCovered(lcov, file, line)) {
        covered += 1;
        fc += 1;
      } else {
        uncovered.push({ file, line });
      }
    }
    if (ft > 0) {
      perFile.push({ file, total: ft, covered: fc });
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
