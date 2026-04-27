import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["admin", "member"] }).notNull(),
});

/**
 * One-time-use / issued card records for this payment product.
 * Full PAN is stored for demo/local SQLite; production must use encryption at rest,
 * key management, and PCI-aligned controls (vault/HSM, access audit, retention).
 */
export const paymentMethods = sqliteTable("payment_methods", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  brand: text("brand", { enum: ["visa", "mastercard", "amex", "unknown"] }).notNull(),
  /** Full card number (OTU issued cards). Do not log or expose outside trusted UI/API. */
  cardNumber: text("card_number").notNull(),
  cvv: text("cvv").notNull(),
  label: text("label"),
  expMonth: integer("exp_month"),
  expYear: integer("exp_year"),
});

export type UserRow = typeof users.$inferSelect;
export type PaymentMethodRow = typeof paymentMethods.$inferSelect;
