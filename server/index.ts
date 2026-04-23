import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { count, eq, ne, and } from "drizzle-orm";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { createDb } from "../db/client";
import { seedUsers } from "../db/seed-data";
import { users } from "../db/schema";
import { CreateUserBodySchema, UpdateUserBodySchema } from "../src/api/users.schemas";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.join(__dirname, "../drizzle");

const db = createDb();
migrate(db, { migrationsFolder });

const countRow = db.select({ c: count() }).from(users).get();
if ((countRow?.c ?? 0) === 0) {
  db.insert(users).values(seedUsers).run();
}

const app = new Hono();

app.get("/api/users", (c) => {
  const rows = db.select().from(users).all();
  return c.json(rows);
});

app.post("/api/users", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  const parsed = CreateUserBodySchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      400
    );
  }
  const id = randomUUID();
  const row = { id, ...parsed.data };
  try {
    db.insert(users).values(row).run();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("UNIQUE constraint") || msg.includes("unique")) {
      return c.json({ error: "A user with this email already exists." }, 409);
    }
    throw e;
  }
  return c.json(row, 201);
});

app.patch("/api/users/:id", async (c) => {
  const id = c.req.param("id");
  if (!id) {
    return c.json({ error: "Missing id" }, 400);
  }
  const existing = db.select().from(users).where(eq(users.id, id)).get();
  if (!existing) {
    return c.json({ error: "User not found." }, 404);
  }
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  const parsed = UpdateUserBodySchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      400
    );
  }
  const otherWithEmail = db
    .select()
    .from(users)
    .where(and(eq(users.email, parsed.data.email), ne(users.id, id)))
    .get();
  if (otherWithEmail) {
    return c.json({ error: "A user with this email already exists." }, 409);
  }
  try {
    db.update(users)
      .set({ name: parsed.data.name, email: parsed.data.email, role: parsed.data.role })
      .where(eq(users.id, id))
      .run();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("UNIQUE constraint") || msg.includes("unique")) {
      return c.json({ error: "A user with this email already exists." }, 409);
    }
    throw e;
  }
  const row = db.select().from(users).where(eq(users.id, id)).get();
  return c.json(row);
});

app.delete("/api/users/:id", (c) => {
  const id = c.req.param("id");
  if (!id) {
    return c.json({ error: "Missing id" }, 400);
  }
  const existing = db.select().from(users).where(eq(users.id, id)).get();
  if (!existing) {
    return c.json({ error: "User not found." }, 404);
  }
  db.delete(users).where(eq(users.id, id)).run();
  // Hono's `c.text`/`c.json` status types use `ContentfulStatusCode` (excludes 204). Use a raw Response for no content.
  return new Response(null, { status: 204 });
});

const port = Number(process.env.PORT) || 8787;
serve({ fetch: app.fetch, port }, (info) => {
  // oxlint-disable-next-line no-console -- local API process startup
  console.log(`API + SQLite listening on http://127.0.0.1:${info.port}`);
});
