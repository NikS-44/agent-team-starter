import { count, eq } from "drizzle-orm";
import type { Db } from "../db/client";
import { paymentMethods, users } from "../db/schema";
import { seedPaymentMethods, seedUsers } from "../db/seed-data";

function ensureSeedUsers(db: Db): void {
  for (const u of seedUsers) {
    const byId = db.select().from(users).where(eq(users.id, u.id)).get();
    if (byId) continue;
    const byEmail = db.select().from(users).where(eq(users.email, u.email)).get();
    if (byEmail) continue;
    db.insert(users).values(u).run();
  }
}

function ensureSeedPaymentMethods(db: Db): void {
  const pmCountRow = db.select({ c: count() }).from(paymentMethods).get();
  if ((pmCountRow?.c ?? 0) > 0) return;

  const userIds = new Set(
    db
      .select({ id: users.id })
      .from(users)
      .all()
      .map((r) => r.id)
  );
  const rows = seedPaymentMethods.filter((pm) => userIds.has(pm.userId));
  if (rows.length > 0) {
    db.insert(paymentMethods).values(rows).run();
  }
}

/**
 * Idempotent demo seed: add missing fixture users (by id), then payment methods
 * when the table is empty. Skips a user if their email is already taken by another row.
 */
export function ensureDemoSeed(db: Db): void {
  ensureSeedUsers(db);
  ensureSeedPaymentMethods(db);
}
