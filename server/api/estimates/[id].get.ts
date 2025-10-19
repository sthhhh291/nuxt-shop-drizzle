import { db } from "~~/server/sqlite-service";
import { estimates } from "~~/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

const paramsSchema = z.object({
  id: z.string().transform((val) => {
    const parsed = Number(val);
    if (isNaN(parsed)) {
      throw new Error("Invalid estimate id.");
    }
    return parsed;
  }),
});

export default eventHandler(async (event) => {
  const params = event.context.params;

  try {
    const { id } = paramsSchema.parse(params);

    const estimate = await db
      .select()
      .from(estimates)
      .where(eq(estimates.id, id))
      .limit(1)
      .then((res) => res[0]);

    if (!estimate) {
      event.res.statusCode = 404;
      return { error: "Estimate not found." };
    }

    return estimate;
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to retrieve estimate. " + error.message };
    }
    return { error: "Failed to retrieve estimate." };
  }
});
