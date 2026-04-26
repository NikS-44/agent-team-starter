import { describe, expect, it } from "vitest";
import type { PatchCoverageResult } from "./computePatchCoverage";
import { formatPatchCoverageComment } from "./formatComment";

describe("formatPatchCoverageComment", () => {
  it("describes N/A when no in-scope diff lines", () => {
    const r: PatchCoverageResult = {
      total: 0,
      covered: 0,
      uncovered: [],
      perFile: [],
    };
    const s = formatPatchCoverageComment(r, {
      baseSha: "a",
      headSha: "b",
      runUrl: "https://run",
      minPct: null,
    });
    expect(s).toContain("not applicable");
  });
});
