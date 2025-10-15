import { NuxtAuthHandler } from "#auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users } from "../../../db/schema";

// Initialize database connection
const sqlite = new Database("./db/dev.db");
const db = drizzle(sqlite);

// Create credentials provider manually
const credentialsProvider = {
  id: "credentials",
  name: "credentials",
  type: "credentials" as const,
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials: any) {
    if (!credentials?.email || !credentials?.password) {
      return null;
    }

    try {
      // Find user by email
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, credentials.email))
        .get();

      if (!user) {
        return null;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(
        credentials.password,
        user.passwordHash
      );

      if (!isValidPassword) {
        return null;
      }

      return {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      console.error("Auth error:", error);
      return null;
    }
  },
};

export default NuxtAuthHandler({
  secret: process.env.NUXT_AUTH_SECRET,
  providers: [credentialsProvider],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
