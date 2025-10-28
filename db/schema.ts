import {
  integer,
  sqliteTable,
  text,
  real,
  sqliteView,
} from "drizzle-orm/sqlite-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { relations, sql } from "drizzle-orm";

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
  engine: text("engine"),
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
  cost: real("cost").notNull(),
  price_per_unit: real("price_per_unit").notNull(),
  estimate_id: integer("estimate_id")
    .notNull()
    .references(() => estimates.id, { onDelete: "cascade" }),
});

export type Oil = InferSelectModel<typeof oil>;
export type InsertOil = InferInsertModel<typeof oil>;

//estimate totals view. used for reports and repair orders
export const estimate_totals = sqliteView("estimate_totals", {
  id: integer("id"),
  date: text("date"),
  labor: real("labor"),
  parts: real("parts"),
  oil: real("oil"),
  subtotal: real("subtotal"),
  tax: real("tax"),
  shop_fees: real("shop_fees"),
  total: real("total"),
  cost: real("cost"),
  parts_margin: real("parts_margin"),
  margin: real("margin"),
}).as(sql`
  select date,id,coalesce(l.labor,0) as labor,
    coalesce(p.parts,0) as parts, 
    coalesce(o.oil,0) as oil,
    coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0) as subtotal,
    round(0.081*(coalesce(p.parts,0)+coalesce(o.oil,0)),2) as tax,
    CASE WHEN coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0) >500 THEN 15
    ELSE round(0.03*(coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0)),2) END as shop_fees,
    coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0)+
    round(0.081*(coalesce(p.parts,0)+coalesce(o.oil,0)),2)+
    CASE WHEN coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0) >500 THEN 15
    ELSE round(0.03*(coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0)),2) END as total,
    coalesce(p.p_cost,0) + coalesce(o.o_cost,0) as cost,
    coalesce(p.parts,0) - coalesce(p.p_cost,0) as parts_margin,
    coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0)+
    round(0.081*(coalesce(p.parts,0)+coalesce(o.oil,0)),2)+
    CASE WHEN coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0) >500 THEN 15
    ELSE round(0.03*(coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0)),2) END -
    coalesce(p.p_cost,0) + coalesce(o.o_cost,0) as margin 
from estimates r
left join (
    select estimate_id,coalesce(sum(price),0) as labor
            from labor
        group by estimate_id) l
on l.estimate_id=r.id
left join (
    select estimate_id,coalesce(sum(unit_price*quantity),0) as parts,
    coalesce(sum(cost*quantity),0) as p_cost
            from parts 
        group by estimate_id) p 
on p.estimate_id=r.id 
left join (
    select estimate_id,coalesce(sum(price_per_unit*quantity),0) as oil,
    coalesce(sum(cost*quantity),0) as o_cost
            from oil 
        group by estimate_id) o 
on o.estimate_id=r.id;
  `);

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

export type customerWithRelations = Customer & {
  phones: Phone[];
  emails: Email[];
  addresses: Address[];
  cars: (Car & {
    estimates: (Estimate & { labor: Labor[]; parts: Part[]; oil: Oil[] })[];
  })[];
};

export type carWithRelations = Car & {
  customer: Customer & {
    phones: Phone[];
    emails: Email[];
    addresses: Address[];
  };
  estimates: (Estimate & { labor: Labor[]; parts: Part[]; oil: Oil[] })[];
};

export type estimateWithRelations = Estimate & {
  car: Car & {
    customer: Customer & {
      phones: Phone[];
      emails: Email[];
      addresses: Address[];
    };
  };
  labor: Labor[];
  parts: Part[];
  oil: Oil[];
};
