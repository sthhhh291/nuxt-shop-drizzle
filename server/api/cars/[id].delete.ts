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

  //   const carSchema = z.object({
  //     make: z.string().min(1, "Make is required"),
  //     model: z.string().min(1, "Model is required"),
  //     year: z
  //       .number()
  //       .int()
  //       .min(1886, "Year must be valid")
  //       .max(new Date().getFullYear(), "Year cannot be in the future"),
  //     vin: z.string().min(1, "VIN is required"),
  //     customer_id: z.number().int().min(1, "Customer ID is required"),
  //   });

  if (event.req.method === "DELETE") {
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

    await db.delete(cars).where(eq(cars.id, carId));

    return {
      message: "Car deleted successfully",
    };
  }
});
