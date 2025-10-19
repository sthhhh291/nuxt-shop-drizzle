import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { relations } from "drizzle-orm";

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

export const phones = sqliteTable("phones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  phone_number: text("phone_number").notNull(),
  phone_type: text("phone_type").notNull(),
  customer_id: integer("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
});

export type Phone = InferSelectModel<typeof phones>;
export type InsertPhone = InferInsertModel<typeof phones>;

export const emails = sqliteTable("emails", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email_address: text("email_address").notNull(),
  email_type: text("email_type").notNull(),
  customer_id: integer("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
});

export type Email = InferSelectModel<typeof emails>;
export type InsertEmail = InferInsertModel<typeof emails>;

export const addresses = sqliteTable("addresses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip_code: text("zip_code").notNull(),
  address_type: text("address_type").notNull(),
  customer_id: integer("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
});

export type Address = InferSelectModel<typeof addresses>;
export type InsertAddress = InferInsertModel<typeof addresses>;

export const cars = sqliteTable("cars", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  vin: text("vin"),
  license: text("license"),
  fleet: text("fleet"),
  notes: text("notes"),
  customer_id: integer("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
});

export type Car = InferSelectModel<typeof cars>;
export type InsertCar = InferInsertModel<typeof cars>;

export const estimates = sqliteTable("estimates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  hours_taken: real("hours_taken").notNull(),
  miles: integer("miles").notNull(),
  estimate_type: text("estimate_type").notNull(),
  private_notes: text("private_notes").notNull(),
  public_notes: text("public_notes").notNull(),
  car_id: integer("car_id")
    .notNull()
    .references(() => cars.id, { onDelete: "cascade" }),
});

export type Estimate = InferSelectModel<typeof estimates>;
export type InsertEstimate = InferInsertModel<typeof estimates>;

export const labor = sqliteTable("labor", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  description: text("description").notNull(),
  hours: real("hours").notNull(),
  rate: real("rate").notNull(),
  price: real("price").notNull(),
  estimate_id: integer("estimate_id")
    .notNull()
    .references(() => estimates.id, { onDelete: "cascade" }),
});

export type Labor = InferSelectModel<typeof labor>;
export type InsertLabor = InferInsertModel<typeof labor>;

export const parts = sqliteTable("parts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  mfr_number: text("mfr_number").notNull(),
  part_number: text("part_number").notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  cost: real("cost").notNull(),
  list: real("list").notNull(),
  unit_price: real("unit_price").notNull(),
  estimate_id: integer("estimate_id")
    .notNull()
    .references(() => estimates.id, { onDelete: "cascade" }),
});

export type Part = InferSelectModel<typeof parts>;
export type InsertPart = InferInsertModel<typeof parts>;

export const oil = sqliteTable("oil", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),
  quantity: real("quantity").notNull(),
  price_per_unit: real("price_per_unit").notNull(),
  estimate_id: integer("estimate_id")
    .notNull()
    .references(() => estimates.id, { onDelete: "cascade" }),
});

export type Oil = InferSelectModel<typeof oil>;
export type InsertOil = InferInsertModel<typeof oil>;

//relations area
export const customersRelations = relations(customers, ({ many }) => ({
  phones: many(phones),
  emails: many(emails),
  addresses: many(addresses),
  cars: many(cars),
}));

export const phonesRelations = relations(phones, ({ one }) => ({
  customer: one(customers, {
    fields: [phones.customer_id],
    references: [customers.id],
  }),
}));

export const emailsRelations = relations(emails, ({ one }) => ({
  customer: one(customers, {
    fields: [emails.customer_id],
    references: [customers.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  customer: one(customers, {
    fields: [addresses.customer_id],
    references: [customers.id],
  }),
}));

export const carsRelations = relations(cars, ({ many, one }) => ({
  customer: one(customers, {
    fields: [cars.customer_id],
    references: [customers.id],
  }),
  estimates: many(estimates),
}));

export const estimatesRelations = relations(estimates, ({ many, one }) => ({
  car: one(cars, {
    fields: [estimates.car_id],
    references: [cars.id],
  }),
  labor: many(labor),
  parts: many(parts),
  oil: many(oil),
}));

export const laborRelations = relations(labor, ({ one }) => ({
  estimate: one(estimates, {
    fields: [labor.estimate_id],
    references: [estimates.id],
  }),
}));

export const partsRelations = relations(parts, ({ one }) => ({
  estimate: one(estimates, {
    fields: [parts.estimate_id],
    references: [estimates.id],
  }),
}));

export const oilRelations = relations(oil, ({ one }) => ({
  estimate: one(estimates, {
    fields: [oil.estimate_id],
    references: [estimates.id],
  }),
}));
