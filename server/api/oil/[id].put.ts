import { db } from "~~/server/sqlite-service";
import { type Oil, oil } from "~~/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const oilSchema = z.object({
  type: z.string(),
  quantity: z.number(),
  cost: z.number(),
  price_per_unit: z.number(),
  estimate_id: z.number(),
});

export default eventHandler(async (event) => {
  try {
    const body = await readBody<Oil>(event);
    const parsedOil = oilSchema.parse(body);
    const updatedOil = await db
      .update(oil)
      .set({
        type: parsedOil.type,
        quantity: parsedOil.quantity,
        cost: parsedOil.cost,
        price_per_unit: parsedOil.price_per_unit,
        estimate_id: parsedOil.estimate_id,
      })
      .where(eq(oil.id, Number(event.context.params?.id)))
      .returning()
      .then((res) => res[0]);

    if (!updatedOil) {
      event.res.statusCode = 404;
      return { error: "Oil not found." };
    }

    return updatedOil;
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to update oil entry. " + error.message };
    }
    return { error: "Failed to update oil entry." };
  }
});
