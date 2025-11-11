import { seedAll } from "../../utils/seed-all";

export default defineEventHandler(async (event) => {
  try {
    const result = await seedAll();
    
    return {
      message: result.success ? "All data seeded successfully" : "Seeding failed",
      ...result
    };
  } catch (error) {
    console.error("Master seeding failed:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Master seeding failed",
    });
  }
});