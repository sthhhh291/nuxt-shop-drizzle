import { db } from "../../sqlite-service";
import { customers } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const idSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

const customerSchema = z.object({
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  notes: z.string().max(255).optional(),
});

export default defineEventHandler(async (event) => {
  const { id } = event.context.params || {};

  const parsedId = idSchema.safeParse({ id });

  if (!parsedId.success) {
    event.res.statusCode = 400;
    return { error: "Invalid ID", details: parsedId.error.format() };
  }

  const customerId = parsedId.data.id;

  if (event.req.method === "PUT") {
    const body = await readBody(event);
    const parsedBody = customerSchema.safeParse(body);

    if (!parsedBody.success) {
      event.res.statusCode = 400;
      return { error: "Invalid request", details: parsedBody.error.format() };
    }

    const { first_name, last_name, notes } = parsedBody.data;

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

    const [updatedCustomer] = await db
      .update(customers)
      .set({ first_name, last_name, notes })
      .where(eq(customers.id, customerId))
      .returning();

    return {
      message: "Customer updated successfully",
      customer: updatedCustomer,
    };
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
