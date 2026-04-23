import { http, HttpResponse } from "msw";
import { seedUsers } from "../../db/seed-data";
import type { ShipVerifyResponse } from "../api/shipVerify.schemas";
import type { User } from "../api/users.schemas";

let userList: User[] = seedUsers.map((u) => ({ ...u }));

export const userFixtures = seedUsers;

function resetList() {
  userList = seedUsers.map((u) => ({ ...u }));
}

export { resetList as resetUserHandlersState };

function parseMockUserBody(body: { name?: string; email?: string; role?: string }):
  | { ok: true; name: string; email: string; role: "admin" | "member" }
  | { ok: false; response: ReturnType<typeof HttpResponse.json> } {
  if (!body.name?.trim() || !body.email || !["admin", "member"].includes(body.role ?? "")) {
    return {
      ok: false,
      response: HttpResponse.json({ error: "Validation failed" }, { status: 400 }),
    };
  }
  return {
    ok: true,
    name: body.name.trim(),
    email: body.email,
    role: body.role as "admin" | "member",
  };
}

export const handlers = [
  http.get("/api/ship-verify", () => {
    const body: ShipVerifyResponse = {
      ok: true,
      checkedAt: new Date().toISOString(),
      database: {
        dialect: "sqlite",
        usersTableReadable: true,
        usersRowCount: userList.length,
        drizzleMigrationsCount: 1,
      },
    };
    return HttpResponse.json(body);
  }),

  http.get("/api/users", () => HttpResponse.json(userList)),

  http.post("/api/users", async ({ request }) => {
    const body = (await request.json()) as { name?: string; email?: string; role?: string };
    const parsedBody = parseMockUserBody(body);
    if (!parsedBody.ok) return parsedBody.response;
    const email = parsedBody.email.toLowerCase();
    if (userList.some((u) => u.email === email)) {
      return HttpResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 }
      );
    }
    const id = globalThis.crypto.randomUUID();
    const user: User = {
      id,
      name: parsedBody.name,
      email: parsedBody.email,
      role: parsedBody.role,
    };
    userList = [...userList, user];
    return HttpResponse.json(user, { status: 201 });
  }),

  http.patch("/api/users/:id", async ({ params, request }) => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) {
      return HttpResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const i = userList.findIndex((u) => u.id === id);
    if (i === -1) {
      return HttpResponse.json({ error: "User not found." }, { status: 404 });
    }
    const body = (await request.json()) as { name?: string; email?: string; role?: string };
    const parsedBody = parseMockUserBody(body);
    if (!parsedBody.ok) return parsedBody.response;
    const email = parsedBody.email;
    if (userList.some((u) => u.id !== id && u.email === email)) {
      return HttpResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 }
      );
    }
    const next: User = {
      id,
      name: parsedBody.name,
      email: parsedBody.email,
      role: parsedBody.role,
    };
    const copy = [...userList];
    copy[i] = next;
    userList = copy;
    return HttpResponse.json(next);
  }),

  http.delete("/api/users/:id", ({ params }) => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) {
      return HttpResponse.json({ error: "Missing id" }, { status: 400 });
    }
    if (!userList.some((u) => u.id === id)) {
      return HttpResponse.json({ error: "User not found." }, { status: 404 });
    }
    userList = userList.filter((u) => u.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];
