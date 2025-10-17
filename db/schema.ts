import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  first_name: text("first_name"),
  last_name: text("last_name"),
  notes: text("notes"),
});

export type Customer = InferSelectModel<typeof customers>;
export type InsertCustomer = InferInsertModel<typeof customers>;

export const cars = sqliteTable("cars", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  vin: text("vin").notNull().unique(),
  customer_id: integer("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
});

export type Car = InferSelectModel<typeof cars>;
export type InsertCar = InferInsertModel<typeof cars>;
