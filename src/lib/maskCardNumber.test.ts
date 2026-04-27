import { describe, expect, it } from "vitest";
import { formatPanGroups, maskCardNumber, maskPanFully } from "./maskCardNumber";

describe("maskCardNumber", () => {
  it("masks all but last four digits", () => {
    expect(maskCardNumber("4242424242424242")).toBe("••••••••••••4242");
  });

  it("returns short strings unchanged", () => {
    expect(maskCardNumber("4242")).toBe("4242");
  });
});

describe("formatPanGroups", () => {
  it("groups digits in quartets", () => {
    expect(formatPanGroups("4242424242424242")).toBe("4242 4242 4242 4242");
  });
});

describe("maskPanFully", () => {
  it("keeps grouping but hides all digits", () => {
    expect(maskPanFully("4242424242424242")).toBe("•••• •••• •••• ••••");
  });
});
