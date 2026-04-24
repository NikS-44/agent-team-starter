#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

pnpm typecheck
pnpm test
pnpm lint
pnpm format:check
pnpm build

if [ "${FALLOW_CI_INITIAL_COMMIT:-}" = "1" ]; then
  # First commit on a branch: no parent ref for audit --changed-since (rare; e.g. new repo).
  pnpm exec fallow dead-code
  pnpm exec fallow dupes
elif [ -n "${FALLOW_CHANGED_SINCE:-}" ]; then
  pnpm exec fallow audit --changed-since "$FALLOW_CHANGED_SINCE"
else
  pnpm fallow:audit
fi
