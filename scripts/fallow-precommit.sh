#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# `fallow audit` scopes with committed refs, so before a commit exists it can miss
# staged/unstaged edits. Collect the HEAD diff ourselves and use file-scoped
# dead-code checks, then run health/duplication gates with project config.
files=()
changed_paths=()
while IFS= read -r file; do
  case "$file" in
    *.ts | *.tsx | *.js | *.jsx | *.mts | *.cts)
      if [[ -f "$file" ]]; then
        changed_paths+=("$file")
        files+=("--file" "$file")
      fi
      ;;
  esac
done < <(git diff --name-only --diff-filter=ACMRT HEAD --)

if [[ ${#files[@]} -gt 0 ]]; then
  pnpm exec fallow dead-code "${files[@]}"
fi

health_json=$(mktemp)
changed_json=$(mktemp)
trap 'rm -f "$health_json" "$changed_json"' EXIT

printf '%s\n' "${changed_paths[@]}" > "$changed_json"
pnpm exec fallow health --format json --quiet > "$health_json" || true
node --input-type=module - "$health_json" "$changed_json" <<'NODE'
import fs from "node:fs";

const [, , healthPath, changedPath] = process.argv;
const changed = new Set(fs.readFileSync(changedPath, "utf8").split(/\r?\n/).filter(Boolean));
const health = JSON.parse(fs.readFileSync(healthPath, "utf8"));
const findings = (health.findings ?? []).filter((finding) => changed.has(finding.path));

if (findings.length > 0) {
  console.error("Fallow health findings in staged/unstaged files:");
  for (const finding of findings) {
    console.error(
      `- ${finding.path}:${finding.line} ${finding.name} ` +
        `(cyclomatic ${finding.cyclomatic}, cognitive ${finding.cognitive})`
    );
  }
  process.exit(1);
}
NODE

pnpm exec fallow dupes --quiet --ignore-imports --min-lines 8 --min-tokens 70
