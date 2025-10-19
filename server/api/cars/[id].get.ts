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
    const car = await db.query.cars.findFirst({
      where: eq(cars.id, carId),
      with: {
        customer: { with: { phones: true, emails: true, addresses: true } },
        estimates: { with: { labor: true, parts: true, oil: true } },
      },
    });

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
