import { db } from "~~/server/sqlite-service";
import { labor } from "~~/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

const paramsSchema = z.object({
  id: z.string().transform((val) => {
    const parsed = Number(val);
    if (isNaN(parsed)) {
      throw new Error("Invalid labor id.");
    }
    return parsed;
  }),
});

export default eventHandler(async (event) => {
  const params = event.context.params;
  const body = await readBody(event);

  try {
    const { id } = paramsSchema.parse(params);

    const updatedCount = await db
      .update(labor)
      .set({
        description: body.description,
        hours: body.hours,
        rate: body.rate,
        estimate_id: body.estimate_id,
        price: body.price ?? body.hours * body.rate,
      })
      .where(eq(labor.id, id))
      .run();

    return { message: "Labor entry updated successfully", updatedCount };
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to update labor entry. " + error.message };
    }
    return { error: "Failed to update labor entry." };
  }
});
