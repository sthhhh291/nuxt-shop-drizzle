import { seedLabor } from "../../utils/seed-labor";

export default defineEventHandler(async (event) => {
  try {
    const result = await seedLabor();
    
    return {
      success: true,
      message: "Labor seeded successfully",
      ...result
    };
  } catch (error) {
    console.error("Labor seeding failed:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Labor seeding failed",
    });
  }
});