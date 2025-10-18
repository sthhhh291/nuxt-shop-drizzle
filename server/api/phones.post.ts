import { db } from "../sqlite-service";
import { phones } from "../../db/schema";
import { z } from "zod";

const phoneSchema = z.object({
  number: z.string().min(10).max(15),
  type: z.enum(["mobile", "landline"]),
  userId: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  if (event.req.method === "POST") {
    const body = await readBody(event);
    const parsedBody = phoneSchema.safeParse(body);

    if (!parsedBody.success) {
      event.res.statusCode = 400;
      return { error: "Invalid request", details: parsedBody.error.format() };
    }

    const { number, type, userId } = parsedBody.data;

    const [newPhone] = await db
      .insert(phones)
      .values({ number, type, userId })
      .returning();

    return { message: "Phone created successfully", phone: newPhone };
  } else if (event.req.method === "GET") {
    const allPhones = await db.select().from(phones);
    return { phones: allPhones };
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
phones;