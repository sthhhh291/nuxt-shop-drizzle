import type { InsertUser } from "~~/db/schema";
import { users } from "~~/db/schema";
import { db } from "../sqlite-service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, passwordHash } = body as {
      name: string;
      passwordHash: string;
    };

    if (!name || !passwordHash) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name and password are required",
      });
    }

    const newUser: InsertUser = {
      name,
      passwordHash,
    };

    const insertedUsers = await db.insert(users).values(newUser).returning();
    return insertedUsers[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
