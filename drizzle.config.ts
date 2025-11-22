import type { Config } from "drizzle-kit";

export default {
  dialect: "turso",
  schema: ["./db/schema.ts", "./auth-schema.ts"],
  out: "./drizzle",
  dbCredentials: {
    url: process.env.TURSO_DB!,
    authToken: process.env.TURSO_TOKEN!,
  },
} satisfies Config;
