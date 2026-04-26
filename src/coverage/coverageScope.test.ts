import { describe, expect, it } from "vitest";
import { isClientCoverageSourceFile } from "./coverageScope";

describe("isClientCoverageSourceFile", () => {
  it("includes normal source under src/", () => {
    expect(isClientCoverageSourceFile("src/pages/Home.tsx")).toBe(true);
  });

  it("excludes test and spec files", () => {
    expect(isClientCoverageSourceFile("src/lib/foo.test.ts")).toBe(false);
    expect(isClientCoverageSourceFile("src/lib/foo.spec.tsx")).toBe(false);
  });

  it("excludes shadcn ui and components-demo", () => {
    expect(isClientCoverageSourceFile("src/components/ui/button.tsx")).toBe(
      false,
    );
    expect(
      isClientCoverageSourceFile("src/pages/components-demo/Foo.tsx"),
    ).toBe(false);
  });

  it("excludes *Types.ts", () => {
    expect(isClientCoverageSourceFile("src/api/routesTypes.ts")).toBe(false);
  });

  it("rejects empty, dot, and non-src paths for inclusion", () => {
    expect(isClientCoverageSourceFile("")).toBe(false);
    expect(isClientCoverageSourceFile(".")).toBe(false);
    expect(isClientCoverageSourceFile("server/s.ts")).toBe(false);
  });
});
