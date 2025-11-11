import { seedOil } from "../../utils/seed-oil";

export default defineEventHandler(async (event) => {
  try {
    const result = await seedOil();
    
    return {
      success: true,
      message: "Oil seeded successfully",
      ...result
    };
  } catch (error) {
    console.error("Oil seeding failed:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Oil seeding failed",
    });
  }
});