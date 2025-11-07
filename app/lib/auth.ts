import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "~~/server/sqlite-service"; // your drizzle instance

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite", // or "mysql", "sqlite"
    }),
    secret: process.env.BETTER_AUTH_SECRET!,
    baseUrl: process.env.BETTER_AUTH_URL!,
    emailAndPassword: {
        enabled: true,
    },
    sessions: {
        jwt: true,
    },
});