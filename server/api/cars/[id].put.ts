import { db } from "~~/server/sqlite-service";
import { cars } from "~~/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  const idSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  });

  const parsedId = idSchema.safeParse({ id });

  if (!parsedId.success) {
    event.res.statusCode = 400;
    return { error: "Invalid ID", details: parsedId.error.format() };
  }

  const carId = parsedId.data.id;

  const carSchema = z.object({
   make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z
      .number()
      .int()
      .min(1886, "Year must be valid")
      .max(new Date().getFullYear(), "Year cannot be in the future"),
    engine: z.string().optional(),
    vin: z.string().optional(),
    license: z.string().optional(),
    fleet_no: z.string().optional(),
    notes: z.string().optional(),
    customer_id: z.number().int().min(1, "Customer ID is required"), 
  });

  if (event.req.method === "PUT") {
    const body = await readBody(event);
    const parsedBody = carSchema.safeParse(body);

    if (!parsedBody.success) {
      event.res.statusCode = 400;
      return { error: "Invalid request", details: parsedBody.error.format() };
    }

    const { make, model, year, vin, customer_id } = parsedBody.data;

    const existingCar = await db
      .select()
      .from(cars)
      .where(eq(cars.id, carId))
      .limit(1)
      .then((res) => res[0]);

    if (!existingCar) {
      event.res.statusCode = 404;
      return { error: "Car not found" };
    }

    const [updatedCar] = await db
      .update(cars)
      .set({ make, model, year, vin, customer_id })
      .where(eq(cars.id, carId))
      .returning();

    return {
      message: "Car updated successfully",
      car: updatedCar,
    };
  }
});
