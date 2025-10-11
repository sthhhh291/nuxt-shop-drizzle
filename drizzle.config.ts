import type { Config } from "drizzle-kit";

export default {
  dialect: "sqlite",
  schema: "./db/schema.ts",
  out: "./drizzle",
  //   driver: "better-sqlite3",
  dbCredentials: {
    url: "./db/dev.db",
  },
} satisfies Config;
