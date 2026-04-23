import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["admin", "member"] }).notNull(),
});

export type UserRow = typeof users.$inferSelect;
