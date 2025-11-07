import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../db/schema.js";
import * as authSchema from "~~/auth-schema";

import Database from "better-sqlite3";
import type {
  // users,
  customers,
  cars,
  estimates,
  labor,
  parts,
  oil,
} from "../db/schema.js";

export const sqlite = new Database("./db/dev.db");
// export const db: BetterSQLite3Database<{
//   users: typeof users;
//   customers: typeof customers;
//   cars: typeof cars;
//   estimates: typeof estimates;
//   labor: typeof labor;
//   parts: typeof parts;
//   oil: typeof oil;
// }> = drizzle(sqlite);

export const db = drizzle(sqlite, {
  schema: { ...schema, ...authSchema },
});
