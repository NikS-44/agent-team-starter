import path from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { createDb } from "../db/client";
import { users } from "../db/schema";
import { seedUsers } from "../db/seed-data";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = createDb();
migrate(db, { migrationsFolder: path.join(__dirname, "../drizzle") });
db.delete(users).run();
db.insert(users).values(seedUsers).run();
