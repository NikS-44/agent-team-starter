import type { Db } from "../db/client";
import { type ShipVerifyResponse, ShipVerifyResponseSchema } from "../src/api/shipVerify.schemas";
import { readDrizzleMigrationCount, readUsersRowCount } from "./shipDbStats";

/** Collects SQLite + Drizzle journal stats for `GET /api/ship-verify`. */
export function getShipVerifyResponse(db: Db): ShipVerifyResponse {
  const usersStats = readUsersRowCount(db);
  const drizzleMigrationsCount = readDrizzleMigrationCount(db);

  const payload = {
    ok: usersStats.readable,
    checkedAt: new Date().toISOString(),
    database: {
      dialect: "sqlite" as const,
      usersTableReadable: usersStats.readable,
      usersRowCount: usersStats.count,
      drizzleMigrationsCount,
    },
  };

  return ShipVerifyResponseSchema.parse(payload);
}
