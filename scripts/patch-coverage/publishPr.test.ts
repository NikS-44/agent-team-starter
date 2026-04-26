import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { runPatchCoveragePublish } from "./publishPr";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("runPatchCoveragePublish", () => {
  it("skips with exit 0 when lcov is missing", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "pcp-"));
    try {
      const out = path.join(dir, "out.md");
      const { exitCode, body } = await runPatchCoveragePublish({
        baseSha: "a",
        headSha: "b",
        lcovPath: path.join(dir, "missing.lcov"),
        cwd: __dirname,
        runUrl: "https://r",
        commentOutPath: out,
        prNumber: 1,
        shouldPostComment: false,
      });
      expect(exitCode).toBe(0);
      expect(body).toBe("");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
