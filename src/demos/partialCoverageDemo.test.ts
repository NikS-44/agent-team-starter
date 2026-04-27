import { describe, expect, it } from "vitest";
import { partialDemoBranch } from "./partialCoverageDemo";

describe("partialCoverageDemo (demo file)", () => {
  it("returns alpha for the alpha mode", () => {
    expect(partialDemoBranch("alpha").tag).toBe("alpha");
  });

  it("returns beta for the beta mode", () => {
    expect(partialDemoBranch("beta").tag).toBe("beta");
  });
});
