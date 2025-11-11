import { seedCars } from "../../utils/seed-cars";

export default defineEventHandler(async (event) => {
  try {
    const result = await seedCars();
    
    return {
      success: true,
      message: "Cars seeded successfully",
      ...result
    };
  } catch (error) {
    console.error("Car seeding failed:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Car seeding failed",
    });
  }
});