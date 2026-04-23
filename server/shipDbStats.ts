import { count } from "drizzle-orm";
import type { Db } from "../db/client";
import { users } from "../db/schema";

export function readUsersRowCount(db: Db): { readable: boolean; count: number } {
  try {
    const row = db.select({ c: count() }).from(users).get();
    return { readable: true, count: row?.c ?? 0 };
  } catch {
    return { readable: false, count: 0 };
  }
}

export function readDrizzleMigrationCount(db: Db): number | null {
  try {
    const row = db.$client.prepare("SELECT COUNT(*) AS c FROM __drizzle_migrations").get() as {
      c: number;
    };
    return row.c;
  } catch {
    return null;
  }
}
