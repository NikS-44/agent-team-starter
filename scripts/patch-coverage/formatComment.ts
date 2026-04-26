import type { PatchCoverageResult } from "./computePatchCoverage";
import { patchCoveragePercent } from "./computePatchCoverage";

const MAX_FILE_ROWS = 40;

/**
 * Build markdown for the sticky PR comment (bot marker is prepended by caller).
 */
export function formatPatchCoverageComment(
  result: PatchCoverageResult,
  meta: { baseSha: string; headSha: string; runUrl: string; minPct: number | null }
): string {
  const pct = patchCoveragePercent(result);
  const headline =
    pct == null
      ? "**No instrumented, in-scope diff lines** in this PR (per `src/coverage/coverageScope.ts` and lcov `DA` lines); patch rate not applicable."
      : `**Patch hit rate (instrumented diff lines only):** ${pct.toFixed(1)}% **(${result.covered} / ${result.total}** covered). Non-executable lines (comments, blanks, etc.) are excluded.`;

  const minLine =
    meta.minPct != null
      ? `**Optional gate:** **PATCH_COVERAGE_MIN_PCT** is **${String(meta.minPct)}** (exits 1 if patch % is below this; unset = informational only).`
      : "**Merge gate** remains **pnpm verify** (global Vitest thresholds). This table is **informational** unless **PATCH_COVERAGE_MIN_PCT** is set in CI.";

  const tableRows: string[] = [
    "",
    "| File | Instrumented diff lines | Covered |",
    "|------|-------------------------|---------|",
  ];
  if (result.perFile.length === 0) {
    tableRows.push("| — | — | — |");
  } else {
    const rows = result.perFile.slice(0, MAX_FILE_ROWS);
    for (const r of rows) {
      tableRows.push(`| \`${r.file}\` | ${r.total} | ${r.covered} |`);
    }
    if (result.perFile.length > MAX_FILE_ROWS) {
      tableRows.push(`| *…* | *${String(result.perFile.length - MAX_FILE_ROWS)} more files* | |`);
    }
  }
  const lines = [
    headline,
    "",
    minLine,
    ...tableRows,
    "",
    "—",
    `Base \`${meta.baseSha}\` · head \`${meta.headSha}\` · [workflow run](${meta.runUrl})`,
  ];
  return lines.join("\n");
}
