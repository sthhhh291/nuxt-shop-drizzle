import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users } from "../../../db/schema";

// Initialize database connection
const sqlite = new Database("./db/dev.db");
const db = drizzle(sqlite);

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method not allowed",
    });
  }

  const body = await readBody(event);
  const { name, email, password } = body;

  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Name, email, and password are required",
    });
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password must be at least 6 characters long",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: "User with this email already exists",
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
      })
      .returning()
      .get();

    // Return user without password
    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      message: "User created successfully",
    };
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
