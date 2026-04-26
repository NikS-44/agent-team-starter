import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isClientCoverageSourceFile } from "../../src/coverage/coverageScope";
import {
  type PatchCoverageResult,
  computePatchCoverage,
  patchCoveragePercent,
} from "./computePatchCoverage";
import { formatPatchCoverageComment } from "./formatComment";
import { parseGitDiffAdditions } from "./parseGitDiff";
import { parseLcov } from "./parseLcov";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const defaultCommentPath = path.join(root, "patch-coverage-comment.md");

function stderr(msg: string): void {
  process.stderr.write(`${msg}\n`);
}

function normalizeLcovFilePath(cwd: string) {
  return (sf: string) => {
    const trimmed = sf.trim();
    if (!trimmed) {
      return "";
    }
    const n = path.normalize(trimmed);
    if (path.isAbsolute(n)) {
      return path.relative(cwd, n).split(path.sep).join("/");
    }
    return n.split(path.sep).join("/");
  };
}

function getOptionalMinPct(): number | null {
  const raw = process.env.PATCH_COVERAGE_MIN_PCT?.trim() ?? "";
  if (raw === "") {
    return null;
  }
  const n = Number.parseFloat(raw);
  if (Number.isNaN(n) || n < 0 || n > 100) {
    stderr("patch-coverage: PATCH_COVERAGE_MIN_PCT must be 0–100; ignoring invalid value");
    return null;
  }
  return n;
}

function emitPatchWarningLines(uncovered: PatchCoverageResult["uncovered"]): void {
  for (const { file, line } of uncovered) {
    const rel = file.split("\\").join("/");
    process.stdout.write(
      `::warning file=${rel},line=${String(line)}::Instrumented line has 0 hits in patch coverage (add or extend a test)\n`
    );
  }
}

async function postCommentIfPossible(
  fullBody: string,
  prNumber: number,
  shouldPost: boolean
): Promise<void> {
  if (!shouldPost) {
    return;
  }
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!token || !repo) {
    stderr("patch-coverage: GITHUB_TOKEN or GITHUB_REPOSITORY missing; comment file written only");
    return;
  }
  try {
    await postPrComment({
      repo,
      token,
      issueNumber: prNumber,
      body: fullBody,
    });
  } catch (err) {
    stderr(
      `patch-coverage: could not post comment: ${err instanceof Error ? err.message : String(err)} (non-fatal)`
    );
  }
}

/**
 * Emits `::warning::` workflow annotations and writes comment markdown.
 * Exits 1 only when `PATCH_COVERAGE_MIN_PCT` is set and patch % is below it.
 */
export async function runPatchCoveragePublish(options: {
  baseSha: string;
  headSha: string;
  lcovPath: string;
  cwd: string;
  runUrl: string;
  commentOutPath: string;
  prNumber: number;
  shouldPostComment: boolean;
}): Promise<{ exitCode: number; body: string }> {
  const minPct = getOptionalMinPct();
  if (!readFileWithCheck(options.lcovPath)) {
    if (!process.env.VITEST) {
      stderr(`patch-coverage: missing or empty lcov at ${options.lcovPath} — skip`);
    }
    return { exitCode: 0, body: "" };
  }

  const lcovRaw = readFileSync(options.lcovPath, "utf8");
  const normalizeLcov = normalizeLcovFilePath(options.cwd);
  const lcov = parseLcov(lcovRaw, normalizeLcov);

  let diffText: string;
  try {
    diffText = execFileSync(
      "git",
      ["-c", "core.quotepath=off", "diff", `${options.baseSha}...${options.headSha}`],
      { cwd: options.cwd, encoding: "utf-8" }
    );
  } catch (e) {
    stderr(`patch-coverage: git diff failed: ${e instanceof Error ? e.message : String(e)}`);
    return { exitCode: 0, body: "" };
  }

  const additions = parseGitDiffAdditions(diffText, () => true);
  const result = computePatchCoverage(lcov, additions, isClientCoverageSourceFile);

  emitPatchWarningLines(result.uncovered);

  const body = formatPatchCoverageComment(result, {
    baseSha: options.baseSha,
    headSha: options.headSha,
    runUrl: options.runUrl,
    minPct: minPct,
  });
  const marker = "<!-- patch-coverage-bot -->\n\n";
  const fullBody = marker + body;

  writeFileSync(options.commentOutPath, fullBody, "utf8");

  await postCommentIfPossible(fullBody, options.prNumber, options.shouldPostComment);

  if (minPct != null) {
    const p = patchCoveragePercent(result);
    if (p != null && p < minPct) {
      stderr(`patch-coverage: ${p.toFixed(1)}% is below PATCH_COVERAGE_MIN_PCT=${String(minPct)}`);
      return { exitCode: 1, body: fullBody };
    }
  }

  return { exitCode: 0, body: fullBody };
}

function readFileWithCheck(p: string): boolean {
  try {
    const s = readFileSync(p, "utf8");
    return s.trim().length > 0;
  } catch {
    return false;
  }
}

type GitHubComment = { id: number; body: string | null };

function githubRestHeaders(token: string): Record<string, string> {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
  };
}

async function postPrComment(p: {
  repo: string;
  token: string;
  issueNumber: number;
  body: string;
}): Promise<void> {
  const [owner, name] = p.repo.split("/");
  if (!owner || !name) {
    throw new Error("Invalid GITHUB_REPOSITORY");
  }
  const headers = githubRestHeaders(p.token);
  const base = `https://api.github.com/repos/${owner}/${name}`;
  const listUrl = `${base}/issues/${String(p.issueNumber)}/comments?per_page=100`;
  const res = await fetch(listUrl, { headers });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`list comments: ${res.status} ${t}`);
  }
  const comments = (await res.json()) as GitHubComment[];
  const existing = comments.find((c) => c.body?.includes("patch-coverage-bot"));
  const jsonHeaders = { ...headers, "Content-Type": "application/json" };
  if (existing) {
    const patchRes = await fetch(`${base}/issues/comments/${String(existing.id)}`, {
      method: "PATCH",
      headers: jsonHeaders,
      body: JSON.stringify({ body: p.body }),
    });
    if (!patchRes.ok) {
      const t = await patchRes.text();
      throw new Error(`update comment: ${patchRes.status} ${t}`);
    }
    return;
  }
  const postRes = await fetch(`${base}/issues/${String(p.issueNumber)}/comments`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ body: p.body }),
  });
  if (!postRes.ok) {
    const t = await postRes.text();
    throw new Error(`create comment: ${postRes.status} ${t}`);
  }
}

type PatchEnvConfig = {
  baseSha: string;
  headSha: string;
  lcovPath: string;
  runUrl: string;
  prNumber: number;
  shouldPost: boolean;
  commentOutPath: string;
};

function readBaseAndHeadShas(): { baseSha: string; headSha: string } | "missing" {
  const baseSha = process.env.BASE_SHA;
  const headSha = process.env.HEAD_SHA;
  if (!baseSha || !headSha) {
    stderr("patch-coverage: BASE_SHA and HEAD_SHA are required");
    return "missing";
  }
  return { baseSha, headSha };
}

function readLcovPathResolved(): string {
  const lcovFromEnv = process.env.LCOV_PATH?.trim() ?? "coverage/lcov.info";
  return path.isAbsolute(lcovFromEnv) ? lcovFromEnv : path.join(root, lcovFromEnv);
}

function readPrNumberIfValid(): number | null {
  const prNumber = Number.parseInt(process.env.PR_NUMBER?.trim() ?? "0", 10);
  if (!Number.isFinite(prNumber) || prNumber < 1) {
    stderr("patch-coverage: PR_NUMBER invalid; skip");
    return null;
  }
  return prNumber;
}

function readActionsRunUrl(): string {
  const s = process.env.GITHUB_SERVER_URL;
  const r = process.env.GITHUB_REPOSITORY;
  const id = process.env.GITHUB_RUN_ID;
  if (!s || !r) {
    return "https://github.com";
  }
  return `${s}/${r}/actions/runs/${id ?? ""}`;
}

function requirePatchEnv(): PatchEnvConfig | "exit-0" {
  const shas = readBaseAndHeadShas();
  if (shas === "missing") {
    return "exit-0";
  }
  const prNumber = readPrNumberIfValid();
  if (prNumber == null) {
    return "exit-0";
  }
  const shouldPost = (process.env.POST_PATCH_COVERAGE_COMMENT?.trim() ?? "1") === "1";
  return {
    baseSha: shas.baseSha,
    headSha: shas.headSha,
    lcovPath: readLcovPathResolved(),
    runUrl: readActionsRunUrl(),
    prNumber,
    shouldPost,
    commentOutPath: process.env.PATCH_COVERAGE_COMMENT_PATH ?? defaultCommentPath,
  };
}

/**
 * Read env, run report + comment (GitHub Actions).
 */
export async function runPatchCoverageFromEnv(): Promise<void> {
  const cfg = requirePatchEnv();
  if (cfg === "exit-0") {
    process.exit(0);
  }
  const { exitCode } = await runPatchCoveragePublish({
    baseSha: cfg.baseSha,
    headSha: cfg.headSha,
    lcovPath: cfg.lcovPath,
    cwd: root,
    runUrl: cfg.runUrl,
    commentOutPath: cfg.commentOutPath,
    prNumber: cfg.prNumber,
    shouldPostComment: cfg.shouldPost,
  });
  process.exit(exitCode);
}
