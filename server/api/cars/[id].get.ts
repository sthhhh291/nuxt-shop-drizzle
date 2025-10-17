import { db } from "~~/server/sqlite-service";
import { cars } from "~~/db/schema";
// import { z } from "zod"; 
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const id = event.context.params?.id;

  try {
    const carId = Number(id);
    if (isNaN(carId)) {
      event.res.statusCode = 400;
      return { error: "Invalid car id." };
    }
    const car = await db.select().from(cars).where(eq(cars.id, carId)).limit(1).then((res) => res[0]);

    if (!car) {
      event.res.statusCode = 404;
      return { error: "Car not found." };
    }

    return car;
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to retrieve car." + error.message };
    }
    return { error: "Failed to retrieve car." };
  }
});
