#!/usr/bin/env bash
# Upload verification PNGs to a new GitHub gist and post them on a PR as inline
# Markdown. Nothing is committed to the app repo. Requires: gh, authenticated.
#
# Usage:
#   scripts/pr-comment-verify-gist.sh <pr-number> <image.png> [image.png ...]
#
# Public gist (listed on your profile): VERIFY_GIST_PUBLIC=1 scripts/...
set -euo pipefail

usage() {
  echo "Usage: $(basename "$0") <pr-number> <image.png> [image.png ...]" >&2
  echo "  Creates a GitHub gist from the images and comments on the PR with inline Markdown." >&2
  echo "  Default gist visibility is secret (unlisted). Set VERIFY_GIST_PUBLIC=1 for a public gist." >&2
  exit 1
}

[[ $# -lt 2 ]] && usage

pr=$1
shift
files=("$@")

for f in "${files[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "Not a file: $f" >&2
    exit 1
  fi
done

branch=$(git branch --show-current 2>/dev/null || echo "unknown")
repo=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "unknown")
desc="Verification for ${repo} PR #${pr} (branch: ${branch})"

# macOS /bin/bash 3.2: empty array + set -u breaks "${arr[@]}"; branch instead of "${public_flag[@]}"
if [[ "${VERIFY_GIST_PUBLIC:-}" == 1 ]]; then
  gist_out=$(gh gist create --public -d "$desc" "${files[@]}")
else
  gist_out=$(gh gist create -d "$desc" "${files[@]}")
fi
gist_url=$(printf '%s\n' "$gist_out" | tail -n 1)
if [[ ! "$gist_url" =~ https://gist\.github\.com/[^/]+/([a-f0-9]+)$ ]]; then
  echo "Could not parse gist URL from gh output:" >&2
  echo "$gist_out" >&2
  exit 1
fi
gist_id="${BASH_REMATCH[1]}"

tmp=$(mktemp)
{
  printf '%s\n' "## Verification evidence"
  printf '%s\n' ""
  printf '%s\n' "Screenshots are hosted in a gist (not in this repo): ${gist_url}"
  printf '%s\n' ""
  gh api "gists/${gist_id}" --jq '.files | to_entries[] | "### " + .key + "\n\n![](" + .value.raw_url + ")\n"'
} >"$tmp"

gh pr comment "$pr" --body-file "$tmp"
rm -f "$tmp"

echo "Posted gist comment on PR #${pr}"
