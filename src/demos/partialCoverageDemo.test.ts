import { describe, expect, it } from "vitest";
import { partialDemoBranch } from "./partialCoverageDemo";

/**
 * We intentionally only exercise the `alpha` branch so the demo module stays
 * **partially** covered (the `beta` return path is 0 hits in lcov for demos).
 */
describe("partialCoverageDemo (demo file)", () => {
  it("exercises the alpha path only", () => {
    expect(partialDemoBranch("alpha").tag).toBe("alpha");
  });
});
