import { db } from "~~/server/sqlite-service";
import { cars } from "~~/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string };

  if (event.req.method === "GET") {
    const customerCars = await db
      .select()
      .from(cars)
      .where(eq(cars.customer_id, Number(id)));
    return { cars: customerCars };
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
