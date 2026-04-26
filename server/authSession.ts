import { eq } from "drizzle-orm";
import type { Context } from "hono";
import type { Db } from "../db/client";
import { authSession } from "../db/schema";
import { LoginBodySchema } from "../src/api/auth.schemas";
import { readJsonOrBadRequest } from "./requestJson";

const AUTH_SESSION_ID = "current";

export function handleGetAuthSession(c: Context, db: Db) {
  const row = db.select().from(authSession).where(eq(authSession.id, AUTH_SESSION_ID)).get();
  if (!row) return c.json(null);
  return c.json({ name: row.name, email: row.email });
}

export async function handlePostAuthSession(c: Context, db: Db) {
  const read = await readJsonOrBadRequest(c);
  if (!read.ok) return read.response;

  const parsed = LoginBodySchema.safeParse(read.body);
  if (!parsed.success) {
    return c.json(
      { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      400
    );
  }

  const row = { id: AUTH_SESSION_ID, ...parsed.data };
  db.insert(authSession)
    .values(row)
    .onConflictDoUpdate({
      target: authSession.id,
      set: { name: row.name, email: row.email },
    })
    .run();

  return c.json({ name: row.name, email: row.email });
}

export function handleDeleteAuthSession(db: Db) {
  db.delete(authSession).where(eq(authSession.id, AUTH_SESSION_ID)).run();
  return new Response(null, { status: 204 });
}
