import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "../mocks/server";
import { fetchShipVerify } from "./shipVerify";

describe("fetchShipVerify", () => {
  it("returns parsed payload on success", async () => {
    server.use(
      http.get("/api/ship-verify", () =>
        HttpResponse.json({
          ok: true,
          checkedAt: "2026-01-01T00:00:00.000Z",
          database: {
            dialect: "sqlite",
            usersTableReadable: true,
            usersRowCount: 2,
            drizzleMigrationsCount: 3,
          },
        })
      )
    );
    const data = await fetchShipVerify();
    expect(data.ok).toBe(true);
    expect(data.database.usersRowCount).toBe(2);
    expect(data.database.drizzleMigrationsCount).toBe(3);
  });

  it("throws on non-ok response", async () => {
    server.use(http.get("/api/ship-verify", () => new HttpResponse(null, { status: 500 })));
    await expect(fetchShipVerify()).rejects.toThrow(/HTTP 500/);
  });
});
