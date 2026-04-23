import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDb } from "../db/client";
import { seedUsers } from "../db/seed-data";
import { users } from "../db/schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = createDb();
migrate(db, { migrationsFolder: path.join(__dirname, "../drizzle") });
db.delete(users).run();
db.insert(users).values(seedUsers).run();
