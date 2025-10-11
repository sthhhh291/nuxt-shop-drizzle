import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import Database from "better-sqlite3";
import type { users } from "../db/schema.js";

export const sqlite = new Database("./db/dev.db");
export const db: BetterSQLite3Database<{
  users: typeof users;
}> = drizzle(sqlite);
