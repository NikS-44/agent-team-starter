import { describe, expect, it } from "vitest";
import { PATCH_COVERAGE_MAX_ANNOTATIONS, buildCheckRunOutput } from "./patchCheckRun";

describe("buildCheckRunOutput", () => {
  it("maps uncovered lines to annotations with stable message", () => {
    const { annotations, truncatedCount } = buildCheckRunOutput([{ file: "src/a.ts", line: 1 }]);
    expect(annotations).toHaveLength(1);
    expect(annotations[0]).toMatchObject({
      path: "src/a.ts",
      start_line: 1,
      end_line: 1,
      annotation_level: "warning",
    });
    expect(truncatedCount).toBe(0);
  });

  it("caps annotations and reports truncated count", () => {
    const many = Array.from({ length: PATCH_COVERAGE_MAX_ANNOTATIONS + 12 }, (_, i) => ({
      file: "src/x.ts",
      line: i + 1,
    }));
    const { annotations, truncatedCount } = buildCheckRunOutput(many);
    expect(annotations).toHaveLength(PATCH_COVERAGE_MAX_ANNOTATIONS);
    expect(truncatedCount).toBe(12);
  });
});
