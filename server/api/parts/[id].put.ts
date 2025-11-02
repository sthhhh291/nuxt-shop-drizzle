import { db } from "~~/server/sqlite-service";
import { parts, type Part } from "~~/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

const partSchema = z.object({
  description: z.string(),
  mfr_number: z.string().optional(),
  part_number: z.string().optional(),
  quantity: z.number(),
  cost: z.number(),
  list: z.number(),
  unit_price: z.number(),
  estimate_id: z.number(),
});

export default eventHandler(async (event) => {
  try {
    const body = await readBody<Part>(event);
    const parsedPart = partSchema.parse(body);
    const newPart = await db
      .update(parts)
      .set({
        description: parsedPart.description,
        mfr_number: parsedPart.mfr_number,
        part_number: parsedPart.part_number,
        quantity: parsedPart.quantity,
        cost: parsedPart.cost,
        list: parsedPart.list,
        unit_price: parsedPart.unit_price,
        estimate_id: parsedPart.estimate_id,
      } as Part)
      .where(eq(parts.id, Number(event.context.params?.id)))
      .returning()
      .then((res) => res[0]);

    if (!newPart) {
      event.res.statusCode = 404;
      return { error: "Part not found." };
    }

    return newPart;
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to update part entry. " + error.message };
    }
    return { error: "Failed to update part entry." };
  }
});
