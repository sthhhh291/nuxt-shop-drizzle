import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "~~/server/sqlite-service"; // your drizzle instance

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"
  }),
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-dev",
  baseUrl: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  sessions: {
    jwt: true,
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://localhost:3000",
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ].filter(Boolean),
});
