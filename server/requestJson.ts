import type { Context } from "hono";

/** Parse JSON body or return a 400 JSON response. */
export async function readJsonOrBadRequest(
  c: Context
): Promise<{ ok: true; body: unknown } | { ok: false; response: Response }> {
  try {
    const body = await c.req.json();
    return { ok: true, body };
  } catch {
    return { ok: false, response: c.json({ error: "Invalid JSON" }, 400) };
  }
}
