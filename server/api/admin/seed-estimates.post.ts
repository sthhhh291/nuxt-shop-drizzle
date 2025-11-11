import { seedEstimates } from "../../utils/seed-estimates";

export default defineEventHandler(async (event) => {
  try {
    const result = await seedEstimates();
    
    return {
      success: true,
      message: "Estimates seeded successfully",
      ...result
    };
  } catch (error) {
    console.error("Estimate seeding failed:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Estimate seeding failed",
    });
  }
});
