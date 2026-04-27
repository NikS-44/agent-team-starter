import path from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { Hono } from "hono";
import { createDb } from "../db/client";
import { paymentMethods, users } from "../db/schema";
import { ensureDemoSeed } from "./ensureDemoSeed";
import { getShipVerifyResponse } from "./shipVerify";
import { existingUserForIdParam } from "./userLookup";
import { handlePatchUser, handlePostUser } from "./userMutations";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.join(__dirname, "../drizzle");

const db = createDb();
migrate(db, { migrationsFolder });
ensureDemoSeed(db);

const app = new Hono();

app.get("/api/ship-verify", (c) => {
  try {
    return c.json(getShipVerifyResponse(db));
  } catch {
    return c.json({ error: "Ship verify failed" }, 500);
  }
});

app.get("/api/users", (c) => {
  const rows = db.select().from(users).all();
  return c.json(rows);
});

app.get("/api/users/:userId/payment-methods", (c) => {
  const resolved = existingUserForIdParam(c, db, c.req.param("userId"));
  if ("response" in resolved) return resolved.response;
  const rows = db
    .select()
    .from(paymentMethods)
    .where(eq(paymentMethods.userId, resolved.user.id))
    .all();
  return c.json(rows);
});

app.post("/api/users", (c) => handlePostUser(c, db));

app.patch("/api/users/:id", (c) => handlePatchUser(c, db));

app.delete("/api/users/:id", (c) => {
  const resolved = existingUserForIdParam(c, db, c.req.param("id"));
  if ("response" in resolved) return resolved.response;
  db.delete(users).where(eq(users.id, resolved.user.id)).run();
  // Hono's `c.text`/`c.json` status types use `ContentfulStatusCode` (excludes 204). Use a raw Response for no content.
  return new Response(null, { status: 204 });
});

const port = Number(process.env.PORT) || 8787;
serve({ fetch: app.fetch, port }, (info) => {
  // oxlint-disable-next-line no-console -- local API process startup
  console.log(`API + SQLite listening on http://127.0.0.1:${info.port}`);
});
