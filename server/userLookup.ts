import { eq } from "drizzle-orm";
import type { Context } from "hono";
import type { Db } from "../db/client";
import { type UserRow, users } from "../db/schema";

/** Resolve `:id` to a row or return a JSON error response (400 / 404). */
export function existingUserForIdParam(
  c: Context,
  db: Db,
  id: string | undefined
): { user: UserRow } | { response: Response } {
  if (!id) {
    return { response: c.json({ error: "Missing id" }, 400) };
  }
  const row = db.select().from(users).where(eq(users.id, id)).get();
  if (!row) {
    return { response: c.json({ error: "User not found." }, 404) };
  }
  return { user: row };
}
