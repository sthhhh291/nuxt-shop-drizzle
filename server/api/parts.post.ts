import { db } from "../sqlite-service";
import { parts, type Part } from "~~/db/schema";
import { z } from "zod";

const partSchema = z.object({
  description: z.string(),
  mfr_number: z.string().optional(),
  part_number: z.string().optional(),
  quantity: z.number(),
  cost: z.number(),
  list: z.number(),
  price: z.number(),
  estimate_id: z.number(),
});

export default eventHandler(async (event) => {
  try {
    const body = await readBody<Part>(event);
    const parsedPart = partSchema.parse(body);
    const newPart = await db
      .insert(parts)
      .values({
        description: parsedPart.description,
        mfr_number: parsedPart.mfr_number,
        part_number: parsedPart.part_number,
        quantity: parsedPart.quantity,
        cost: parsedPart.cost,
        list: parsedPart.list,
        price: parsedPart.price,
        estimate_id: parsedPart.estimate_id,
      } as any)
      .returning()
      .then((res) => res[0]);

    return newPart;
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to create part entry. " + error.message };
    }
    return { error: "Failed to create part entry." };
  }
});
