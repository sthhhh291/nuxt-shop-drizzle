import { db } from "../sqlite-service";
import { type Estimate, estimates } from "~~/db/schema";

export default eventHandler(async (event) => {
  try {
    const estimatesList: Estimate[] = await db.select().from(estimates).limit(20);

    return estimatesList;
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to retrieve estimates. " + error.message };
    }
    return { error: "Failed to retrieve estimates." };
  }
});
