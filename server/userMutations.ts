import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { Context } from "hono";
import type { ZodSchema } from "zod";
import type { Db } from "../db/client";
import { users } from "../db/schema";
import type { UpdateUserBody } from "../src/api/users.schemas";
import { CreateUserBodySchema, UpdateUserBodySchema } from "../src/api/users.schemas";
import { readJsonOrBadRequest } from "./requestJson";
import { existingUserForIdParam } from "./userLookup";
import { anotherUserHasEmail, insertUserRow, updateUserRow } from "./userPersist";

async function parseJsonBodyWithSchema<T>(
  c: Context,
  schema: ZodSchema<T>
): Promise<{ ok: true; data: T } | { ok: false; response: Response }> {
  const read = await readJsonOrBadRequest(c);
  if (!read.ok) return { ok: false, response: read.response };

  const parsed = schema.safeParse(read.body);
  if (!parsed.success) {
    return {
      ok: false,
      response: c.json(
        { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
        400
      ),
    };
  }
  return { ok: true, data: parsed.data };
}

export async function handlePostUser(c: Context, db: Db) {
  const parsed = await parseJsonBodyWithSchema(c, CreateUserBodySchema);
  if (!parsed.ok) return parsed.response;

  const id = randomUUID();
  const row = { id, ...parsed.data };
  const inserted = insertUserRow(db, row);
  if (!inserted.ok) {
    return c.json({ error: "A user with this email already exists." }, 409);
  }
  return c.json(row, 201);
}

function jsonPatchUserResponse(c: Context, db: Db, id: string, body: UpdateUserBody) {
  if (anotherUserHasEmail(db, id, body.email)) {
    return c.json({ error: "A user with this email already exists." }, 409);
  }

  const updated = updateUserRow(db, id, body);
  if (!updated.ok) {
    return c.json({ error: "A user with this email already exists." }, 409);
  }

  const row = db.select().from(users).where(eq(users.id, id)).get();
  return c.json(row);
}

export async function handlePatchUser(c: Context, db: Db) {
  const resolved = existingUserForIdParam(c, db, c.req.param("id"));
  if ("response" in resolved) return resolved.response;

  const parsed = await parseJsonBodyWithSchema(c, UpdateUserBodySchema);
  if (!parsed.ok) return parsed.response;

  return jsonPatchUserResponse(c, db, resolved.user.id, parsed.data);
}
