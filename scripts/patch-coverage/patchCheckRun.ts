import type { PatchCoverageResult } from "./computePatchCoverage";

/** GitHub allows at most 50 annotations per create/update of a check run output. */
export const PATCH_COVERAGE_MAX_ANNOTATIONS = 50;

type CheckAnnotation = {
  path: string;
  start_line: number;
  end_line: number;
  annotation_level: "warning";
  message: string;
  title: string;
};

type CheckRunPayload = {
  annotations: CheckAnnotation[];
  /** Lines not sent because of the 50-annotation cap */
  truncatedCount: number;
};

const ANNOTATION_MSG = "Instrumented line has 0 test hits in the PR patch (add or extend a test).";

/**
 * Map uncovered lines to GitHub Check `output.annotations` (capped for API limits).
 */
export function buildCheckRunOutput(uncovered: PatchCoverageResult["uncovered"]): CheckRunPayload {
  const take = uncovered.slice(0, PATCH_COVERAGE_MAX_ANNOTATIONS);
  const annotations: CheckAnnotation[] = take.map((u) => {
    const rel = u.file.split("\\").join("/");
    return {
      path: rel,
      start_line: u.line,
      end_line: u.line,
      annotation_level: "warning",
      message: ANNOTATION_MSG,
      title: "Patch coverage",
    };
  });
  return {
    annotations,
    truncatedCount: Math.max(0, uncovered.length - take.length),
  };
}

type PostCheckInput = {
  owner: string;
  repo: string;
  token: string;
  headSha: string;
  checkName: string;
  detailsUrl: string;
  /**
   * Short summary; GitHub enforces a size limit (≈64 KiB) on `summary` for practical use.
   */
  summary: string;
  /** Use `failure` when optional patch gate fails, else `success` (annotations still show as warnings in the diff). */
  conclusion: "success" | "failure";
  payload: CheckRunPayload;
};

/**
 * Create a [Check run](https://docs.github.com/en/rest/checks/runs) so `output.annotations`
 * appear on the PR **Files changed** tab for `head_sha` (same repo only; fork PRs often 403).
 */
export async function postPatchCoverageCheckRun(p: PostCheckInput): Promise<void> {
  const { truncatedCount, annotations } = p.payload;
  const more =
    truncatedCount > 0
      ? `\n\n_Only the first ${String(PATCH_COVERAGE_MAX_ANNOTATIONS)} diff locations are annotated (${String(truncatedCount)} more); see the PR comment for the full list._`
      : "";
  const output = {
    title: p.checkName,
    summary: `${p.summary.slice(0, 60000)}${more}`,
    annotations,
  };
  const body = {
    name: p.checkName,
    head_sha: p.headSha,
    status: "completed" as const,
    completed_at: new Date().toISOString(),
    conclusion: p.conclusion,
    details_url: p.detailsUrl,
    output,
  };
  const res = await fetch(`https://api.github.com/repos/${p.owner}/${p.repo}/check-runs`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${p.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`check-runs: ${res.status} ${t}`);
  }
}
