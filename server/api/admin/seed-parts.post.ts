import { seedParts } from "../../utils/seed-parts";

export default defineEventHandler(async (event) => {
  try {
    const result = await seedParts();
    
    return {
      success: true,
      message: "Parts seeded successfully",
      ...result
    };
  } catch (error) {
    console.error("Parts seeding failed:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Parts seeding failed",
    });
  }
});