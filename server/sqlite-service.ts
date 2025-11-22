import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../db/schema.js";
import * as authSchema from "~~/auth-schema";

export const client = createClient({
  url: process.env.TURSO_DB!,
  authToken: process.env.TURSO_TOKEN!,
});

export const db = drizzle(client, {
  schema: { ...schema, ...authSchema },
});
