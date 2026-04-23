import { and, eq, ne } from "drizzle-orm";
import type { Db } from "../db/client";
import { type UserRow, users } from "../db/schema";
import { isSqliteUniqueViolation } from "./sqliteErrors";

type InsertRow = { id: string; name: string; email: string; role: "admin" | "member" };

export function insertUserRow(
  db: Db,
  row: InsertRow
): { ok: true } | { ok: false; conflict: true } {
  try {
    db.insert(users).values(row).run();
    return { ok: true };
  } catch (e) {
    if (isSqliteUniqueViolation(e)) return { ok: false, conflict: true };
    throw e;
  }
}

export function anotherUserHasEmail(db: Db, id: string, email: string): boolean {
  return Boolean(
    db
      .select()
      .from(users)
      .where(and(eq(users.email, email), ne(users.id, id)))
      .get()
  );
}

export function updateUserRow(
  db: Db,
  id: string,
  data: Pick<UserRow, "name" | "email" | "role">
): { ok: true } | { ok: false; conflict: true } {
  try {
    db.update(users).set(data).where(eq(users.id, id)).run();
    return { ok: true };
  } catch (e) {
    if (isSqliteUniqueViolation(e)) return { ok: false, conflict: true };
    throw e;
  }
}
