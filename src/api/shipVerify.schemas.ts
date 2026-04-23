import { z } from "zod";

/** Response from `GET /api/ship-verify` — proves API + SQLite + Drizzle journal are reachable. */
export const ShipVerifyResponseSchema = z.object({
  ok: z.boolean(),
  checkedAt: z.string(),
  database: z.object({
    dialect: z.literal("sqlite"),
    usersTableReadable: z.boolean(),
    usersRowCount: z.number().int().nonnegative(),
    /** Rows in `__drizzle_migrations`; `null` if the journal table could not be read. */
    drizzleMigrationsCount: z.number().int().nonnegative().nullable(),
  }),
});

export type ShipVerifyResponse = z.infer<typeof ShipVerifyResponseSchema>;
