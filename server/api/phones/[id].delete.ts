import { db } from "~~/server/sqlite-service";
import { eq } from "drizzle-orm";
import { phones } from "~~/db/schema";
import { z } from "zod";

const phoneSchema = z.object({
  phone_number: z.string().min(10).max(15),
  phone_type: z.enum(["mobile", "landline"]),
  customer_id: z.number().int(),
});

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string };

  if (event.req.method === "DELETE") {
    const deleteResult = await db
      .delete(phones)
      .where(eq(phones.id, Number(id)));

    const affectedRows =
      typeof deleteResult === "number" ? deleteResult
      : "changes" in deleteResult ? deleteResult.changes
      : 0;

    if (affectedRows === 0) {
      event.res.statusCode = 404;
      return { error: "Phone not found" };
    }

    return { message: "Phone deleted successfully" };
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
