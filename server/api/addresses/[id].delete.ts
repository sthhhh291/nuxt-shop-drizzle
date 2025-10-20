import { db } from "~~/server/sqlite-service";
import { addresses } from "~~/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const idSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

export default defineEventHandler(async (event) => {
  const { id } = event.context.params || {};

  const parsedId = idSchema.safeParse({ id });

  if (!parsedId.success) {
    event.res.statusCode = 400;
    return { error: "Invalid ID", details: parsedId.error.format() };
  }

  const addressId = parsedId.data.id;

  if (event.req.method === "DELETE") {
    const address = await db
      .delete(addresses)
      .where(eq(addresses.id, addressId));
    if (!address) {
      event.res.statusCode = 404;
      return { error: "Address not found" };
    }

    return { message: "Address deleted successfully" };
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
