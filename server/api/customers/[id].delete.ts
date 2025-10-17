import { db } from "../../sqlite-service";
import { customers } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params || {};

  const idSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  });

  const parsedId = idSchema.safeParse({ id });

  if (!parsedId.success) {
    event.res.statusCode = 400;
    return { error: "Invalid ID", details: parsedId.error.format() };
  }

  const customerId = parsedId.data.id;

  if (event.req.method === "DELETE") {
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1)
      .then((res) => res[0]);

    if (!existingCustomer) {
      event.res.statusCode = 404;
      return { error: "Customer not found" };
    }

    await db.delete(customers).where(eq(customers.id, customerId));

    return { message: "Customer deleted successfully" };
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
