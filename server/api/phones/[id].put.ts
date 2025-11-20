import { db } from "~~/server/sqlite-service";
import { phones } from "~~/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const phoneSchema = z.object({
  phone_number: z.string().min(10).max(15),
  phone_type: z.enum(["Cell", "Home", "Work"]),
  customer_id: z.number().int(),
});

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string };

  if (event.req.method === "PUT") {
    const body = await readBody(event);
    const parsedBody = phoneSchema.safeParse(body);

    if (!parsedBody.success) {
      event.res.statusCode = 400;
      return { error: "Invalid request", details: parsedBody.error.format() };
    }

    const { phone_number, phone_type, customer_id } = parsedBody.data;

    const updateResult = await db
      .update(phones)
      .set({ phone_number, phone_type, customer_id })
      .where(eq(phones.id, Number(id)));

    const affectedRows =
      typeof updateResult === "number" ? updateResult
      : "changes" in updateResult ? updateResult.changes
      : 0;

    if (affectedRows === 0) {
      event.res.statusCode = 404;
      return { error: "Phone not found" };
    }

    const updatedPhone = await db
      .select()
      .from(phones)
      .where(eq(phones.id, Number(id)))
      .get();

    return { message: "Phone updated successfully", phone: updatedPhone };
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
