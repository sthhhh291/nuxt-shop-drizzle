import type { InferModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export type User = InferModel<typeof users>;
export type InsertUser = InferModel<typeof users, "insert">;

// export const customers = sqliteTable("customers", {
//   id: integer("id").primaryKey({ autoIncrement: true }),
//   first_name: text("first_name"),
//   last_name: text("last_name"),
//   notes: text("notes"),
// });
