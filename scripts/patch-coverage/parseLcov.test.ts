import { describe, expect, it } from "vitest";
import { parseLcov } from "./parseLcov";

const norm = (s: string) => s.split("\\").join("/").trim();

describe("parseLcov", () => {
  it("maps DA line hits", () => {
    const lcov = ["SF:src/n/a.ts", "DA:1,2", "DA:2,0", "end_of_record"].join("\n");
    const m = parseLcov(lcov, norm);
    const a = m.get("src/n/a.ts");
    expect(a).toBeDefined();
    expect(a?.da.get(1)).toBe(2);
    expect(a?.da.get(2)).toBe(0);
  });
});
