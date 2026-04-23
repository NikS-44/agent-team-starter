import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const dbPath = path.join(dataDir, "local.sqlite");

export function createDb(dbFilePath = dbPath) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const sqlite = new Database(dbFilePath);
  sqlite.pragma("journal_mode = WAL");
  return drizzle(sqlite, { schema });
}

export type Db = ReturnType<typeof createDb>;
