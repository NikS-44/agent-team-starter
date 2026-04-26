import { describe, expect, it } from "vitest";
import { parseGitDiffAdditions } from "./parseGitDiff";

describe("parseGitDiffAdditions", () => {
  it("collects + line numbers in a new file", () => {
    const d = [
      "diff --git a/src/x.ts b/src/x.ts",
      "new file mode 100644",
      "--- /dev/null",
      "+++ b/src/x.ts",
      "@@ -0,0 +1,2 @@",
      "+a",
      "+b",
    ].join("\n");
    const m = parseGitDiffAdditions(d, () => true);
    expect(m.get("src/x.ts")).toEqual([1, 2]);
  });

  it("handles context and minus lines in hunks", () => {
    const d = [
      "diff --git a/src/f.ts b/src/f.ts",
      "--- a/src/f.ts",
      "+++ b/src/f.ts",
      "@@ -1,1 +1,2 @@",
      " old",
      "+inserted",
    ].join("\n");
    const m = parseGitDiffAdditions(d, () => true);
    expect(
      m
        .get("src/f.ts")
        ?.sort((a, b) => a - b)
        .includes(2)
    ).toBe(true);
  });
});
