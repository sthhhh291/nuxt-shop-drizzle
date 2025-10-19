import { db } from "../sqlite-service";
import { cars, customers, customersRelations } from "../../db/schema";
import { z } from "zod";

const customerSchema = z.object({
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  notes: z.string().max(255).optional(),
});

export default defineEventHandler(async (event) => {
  if (event.req.method === "POST") {
    const body = await readBody(event);
    const parsedBody = customerSchema.safeParse(body);

    if (!parsedBody.success) {
      event.res.statusCode = 400;
      return { error: "Invalid request", details: parsedBody.error.format() };
    }

    const { first_name, last_name, notes } = parsedBody.data;

    const [newCustomer] = await db
      .insert(customers)
      .values({ first_name, last_name, notes })
      .returning();

    return { message: "Customer created successfully", customer: newCustomer };
  } else if (event.req.method === "GET") {
    // Use the relational query syntax with proper relations
    const allCustomers = await db.query.customers.findMany({
      with: {
        cars: {
          with: {
            estimates: { with: { labor: true, parts: true, oil: true } },
          },
        }, // This should reference the relation name, not the table
        phones: true,
        emails: true,
        addresses: true,
      },
    });

    return { customers: allCustomers };
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
