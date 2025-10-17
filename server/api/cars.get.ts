import { db } from "../sqlite-service";
import { cars } from "../../db/schema";
// import { /z } from "zod";

export default eventHandler(async (event) => {
  try {
    const allCars = await db.select().from(cars);
    return allCars;
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to retrieve cars." + error.message };
    }
    return { error: "Failed to retrieve cars." };
  }
});
