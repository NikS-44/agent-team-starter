import path from "node:path";

function normalizeDiffPath(p: string): string {
  const withoutB = p.startsWith("b/") ? p.slice(2) : p;
  if (withoutB === "/dev/null" || !withoutB) {
    return "";
  }
  return path.normalize(withoutB).split(path.sep).join("/");
}

function additionLineAfterHunkLine(
  h: string,
  newLine: number,
  current: string,
  push: (f: string, n: number) => void
): number {
  const c0 = h[0];
  if (c0 === " " || c0 === "\t") {
    return newLine + 1;
  }
  if (c0 === "-") {
    return newLine;
  }
  if (c0 === "+") {
    if (h.startsWith("+++")) {
      return newLine;
    }
    push(current, newLine);
    return newLine + 1;
  }
  return newLine;
}

function consumeOneHunk(
  lines: readonly string[],
  i: number,
  newLineStart: number,
  current: string,
  push: (f: string, n: number) => void
): number {
  let linePos = i;
  let newLine = newLineStart;
  while (linePos < lines.length) {
    const h = lines[linePos] ?? "";
    if (h.startsWith("@@") || h.startsWith("diff --git ")) {
      break;
    }
    newLine = additionLineAfterHunkLine(h, newLine, current, push);
    linePos += 1;
  }
  return linePos;
}

/**
 * New-file line numbers added in a unified `git diff` (three-dot) output.
 * Ignores non-source paths and "binary differ" blocks.
 */
export function parseGitDiffAdditions(
  diffText: string,
  isRelevant: (relPath: string) => boolean
): Map<string, number[]> {
  const acc = new Map<string, number[]>();
  const push = (f: string, n: number) => {
    if (!isRelevant(f)) {
      return;
    }
    const arr = acc.get(f) ?? [];
    arr.push(n);
    acc.set(f, arr);
  };

  const lines = diffText.split(/\r?\n/);
  let i = 0;
  let current: string | undefined;
  const max = lines.length;

  const tryParseHunk = (at: number, file: string | undefined) => {
    if (!file) {
      return at + 1;
    }
    const line = lines[at] ?? "";
    if (!line.startsWith("@@ ")) {
      return at + 1;
    }
    const m = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@( .*|$)/);
    if (!m) {
      return at + 1;
    }
    const newLine = Number.parseInt(m[3] ?? "0", 10);
    return consumeOneHunk(lines, at + 1, newLine, file, push);
  };

  while (i < max) {
    const line = lines[i] ?? "";
    if (line.startsWith("Binary files ") && line.includes(" differ")) {
      current = undefined;
    } else if (line.startsWith("+++ ")) {
      const raw = line.slice(4).trim();
      current = normalizeDiffPath(raw) || undefined;
    } else if (line.startsWith("@@ ")) {
      i = tryParseHunk(i, current) - 1;
    }
    i += 1;
  }

  for (const [f, arr] of acc) {
    const unique = [...new Set(arr)].sort((a, b) => a - b);
    acc.set(f, unique);
  }
  return acc;
}
