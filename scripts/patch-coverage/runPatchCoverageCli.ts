import { runPatchCoverageFromEnv } from "./publishPr";

void runPatchCoverageFromEnv().catch((err) => {
  process.stderr.write(`patch-coverage: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
