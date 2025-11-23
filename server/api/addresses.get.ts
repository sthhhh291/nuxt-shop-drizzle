import { db } from "../sqlite-service";
import { addresses } from "~~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const allAddresses = await db.select().from(addresses);
    return allAddresses;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch addresses",
    });
  }
});
