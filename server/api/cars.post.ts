import { db } from "../sqlite-service";
import { cars } from "../../db/schema";
import type { InsertCar } from "../../db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const body = await readBody(event);

  const carSchema = z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z
      .number()
      .int()
      .min(1886, "Year must be valid")
      .max(new Date().getFullYear(), "Year cannot be in the future"),
    engine: z.string().optional(),
    vin: z.string().min(1, "VIN is required"),
    license: z.string().min(1, "License is required"),
    fleet_no: z.string().min(1, "Fleet number is required"),
    notes: z.string().optional(),
    customer_id: z.number().int().min(1, "Customer ID is required"),
  });

  const parsedCar = carSchema.safeParse(body);

  if (!parsedCar.success) {
    event.res.statusCode = 400;
    return { errors: parsedCar.error.errors.map((e) => e.message) };
  }

  const newCar: InsertCar = {
    make: parsedCar.data.make,
    model: parsedCar.data.model,
    year: parsedCar.data.year,
    engine: parsedCar.data.engine,
    vin: parsedCar.data.vin,
    license: parsedCar.data.license,
    fleet: parsedCar.data.fleet_no,
    notes: parsedCar.data.notes,
    customer_id: parsedCar.data.customer_id,
  };

  try {
    const result = await db.insert(cars).values(newCar);
    const insertedId = result.lastInsertRowid;

    // Return the created car with all its data
    const createdCar = await db
      .select()
      .from(cars)
      .where(eq(cars.id, insertedId as number));
    return createdCar[0];
  } catch (dbError) {
    event.res.statusCode = 500;
    return {
      error:
        "Failed to add car. It might be due to a duplicate VIN or invalid customer ID." +
        dbError,
    };
  }
});
