# Committed ship evidence (screenshots)

Use this folder for **git-tracked** full-page **before** and **after** images so `/ship-report` can show a visual delta alongside `public/ship-reports/` galleries. Code review stays in the PR diff; we do **not** commit a `diff.txt` here.

## Per feature

1. Create `public/screenshots/<your-slug>/`.
2. Add **`before.png`** (or `.webp`) — UI from the **base** branch (e.g. `main`), same URL and viewport as the “after” shot.
3. Add **`after.png`** — same route on your **feature** branch.
4. Register **`branchEvidence`** on your entry in `src/data/shipReports.ts` with `beforeSrc` / `afterSrc` pointing at `/screenshots/<your-slug>/…`.

The template slug **`local-evidence-template`** ships with tiny SVG stand-ins so the page works before you replace them with real PNGs.
