/**
 * Recreates .cursor / .claude symlinks into .ai-rules/ (single source of truth).
 * Idempotent. Run after clone if Git did not check out symlinks (e.g. Windows).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")

/**
 * @param {string} targetAbs — absolute path to link target
 * @param {string} linkAbs — absolute path of symlink to create
 * @param {"file" | "dir"} type
 */
function ensureSymlink(targetAbs, linkAbs, type) {
  const isDir = type === "dir"
  if (fs.existsSync(linkAbs)) {
    let stat
    try {
      stat = fs.lstatSync(linkAbs)
    } catch {
      return
    }
    if (stat.isSymbolicLink()) {
      if (fs.realpathSync(linkAbs) === path.resolve(targetAbs)) {
        return
      }
    }
    fs.rmSync(linkAbs, { recursive: true, force: true })
  } else {
    fs.mkdirSync(path.dirname(linkAbs), { recursive: true })
  }
  const rel = path.relative(path.dirname(linkAbs), targetAbs)
  fs.symlinkSync(rel, linkAbs, isDir ? "dir" : "file")
}

const links = [
  [path.join(root, ".ai-rules/skills"), path.join(root, ".cursor/skills"), "dir"],
  [path.join(root, ".ai-rules/commands"), path.join(root, ".cursor/commands"), "dir"],
  [path.join(root, ".ai-rules/rules"), path.join(root, ".cursor/rules"), "dir"],
  [path.join(root, ".ai-rules/mcp.json"), path.join(root, ".cursor/mcp.json"), "file"],
  [path.join(root, ".ai-rules/skills"), path.join(root, ".claude/skills"), "dir"],
  [path.join(root, ".ai-rules/commands"), path.join(root, ".claude/commands"), "dir"],
  [path.join(root, ".ai-rules/rules"), path.join(root, ".claude/rules"), "dir"],
  [path.join(root, ".ai-rules/agents"), path.join(root, ".claude/agents"), "dir"],
]

for (const [target, link, t] of links) {
  if (!fs.existsSync(target)) {
    console.warn(`[ai-rules] skip missing target: ${path.relative(root, target)}`)
    continue
  }
  try {
    ensureSymlink(target, link, /** @type {"file"|"dir"} */ (t))
  } catch (e) {
    console.warn(`[ai-rules] could not link ${path.relative(root, link)}:`, e)
  }
}
