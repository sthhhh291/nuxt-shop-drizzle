import { seedContacts } from "../../utils/seed-contacts";

export default defineEventHandler(async (event) => {
  try {
    await seedContacts();
    
    return {
      success: true,
      message: "Contacts seeded successfully"
    };
  } catch (error) {
    console.error("Seeding failed:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Seeding failed",
    });
  }
});
