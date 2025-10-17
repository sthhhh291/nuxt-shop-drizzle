import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../../../server/sqlite-service";
import { z } from "zod";
import { hash } from "bcrypt";

const registerSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
  password_hash: z.string().min(6).max(100),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("Register body:", body);

  const parsedBody = registerSchema.safeParse(body);

  if (!parsedBody.success) {
    event.res.statusCode = 400;
    return { error: "Invalid request", details: parsedBody.error.format() };
  }

  const { name, email, password_hash } = parsedBody.data;

  // Check if user with the same email or username already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    // .orWhere(eq(users.username, username))
    .limit(1);

  if (existingUser.length > 0) {
    event.res.statusCode = 409;
    return { error: "User with this email or username already exists" };
  }

  // Hash the password before storing it
  const hashedPassword = await hash(password_hash, 10);

  // Create new user
  const [newUser] = await db
    .insert(users)
    .values({ name, email, passwordHash: hashedPassword })
    .returning();

  return { message: "User registered successfully", userId: newUser.id };
});
