import type { User } from "../../../db/schema";
import { users } from "../../../db/schema";
import { db } from "../../sqlite-service";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.ID;
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }
  try {
    const userResponse: User | null =
      db
        .select()
        .from(users)
        .where(eq(users.id, Number(id)))
        .get() ?? null;
    return { userResponse };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
