#!/usr/bin/env bash
# Block commits on a feature branch that already has a merged PR on GitHub.
# After a PR merges, use a new branch from main for further work.
#
# - Primary: gh pr list --state merged (merge and squash merges).
# - Fallback (no gh / gh failure): origin/main contains branch tip (merge-style only).
#
# Once:  SKIP_MERGED_BRANCH_GUARD=1 git commit
set -euo pipefail

if [ -n "${SKIP_MERGED_BRANCH_GUARD:-${HUSKY_SKIP_MERGED_BRANCH_GUARD:-}}" ]; then
  exit 0
fi

branch=$(git branch --show-current 2>/dev/null) || true
if [ -z "$branch" ]; then
  exit 0
fi

case "$branch" in
  main | master) exit 0 ;;
esac

if command -v gh >/dev/null 2>&1; then
  if count=$(gh pr list --head "$branch" --state merged --json number --jq 'length' 2>/dev/null); then
    if [ "$count" -gt 0 ]; then
      cat >&2 <<EOF
precommit-merged-pr-guard: branch '$branch' has a merged pull request on GitHub.
Create a new branch from the default branch, for example:
  git fetch origin
  git switch -c user/topic-slug origin/main
To commit anyway: SKIP_MERGED_BRANCH_GUARD=1 git commit
EOF
      exit 1
    fi
    exit 0
  fi
fi

# Fallback: no gh or gh failed (offline / not authenticated).
if git show-ref --verify --quiet refs/remotes/origin/main 2>/dev/null; then
  if git merge-base --is-ancestor "$branch" origin/main 2>/dev/null; then
    cat >&2 <<EOF
precommit-merged-pr-guard: branch tip of '$branch' is already in origin/main (merge history).
For squash-merged PRs, use GitHub CLI and auth: gh auth login
To commit anyway: SKIP_MERGED_BRANCH_GUARD=1 git commit
EOF
    exit 1
  fi
fi

exit 0
