import { describe, expect, it } from "vitest";
import { computePatchCoverage, patchCoveragePercent } from "./computePatchCoverage";
import type { LcovLineHits } from "./parseLcov";
import { parseLcov } from "./parseLcov";

describe("computePatchCoverage", () => {
  it("classifies diff lines with lcov hit counts", () => {
    const lcovText = ["SF:src/m.ts", "DA:1,1", "DA:2,0", "end_of_record"].join("\n");
    const lcov = parseLcov(lcovText, (s) => s);
    const additions = new Map<string, number[]>([["src/m.ts", [1, 2]]]);
    const r = computePatchCoverage(lcov, additions, (p) => p === "src/m.ts");
    expect(r.total).toBe(2);
    expect(r.covered).toBe(1);
    expect(r.uncovered).toEqual([{ file: "src/m.ts", line: 2 }]);
    expect(patchCoveragePercent(r)).toBe(50);
  });

  it("treats missing lcov for file as uncovered", () => {
    const lcov = new Map<string, LcovLineHits>();
    const additions = new Map([["src/onlyInDiff.ts", [5]]]);
    const r = computePatchCoverage(lcov, additions, (p) => p === "src/onlyInDiff.ts");
    expect(r.covered).toBe(0);
    expect(r.total).toBe(1);
  });
});
