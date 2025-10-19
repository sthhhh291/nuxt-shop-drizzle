import { db } from "../sqlite-service";
import { oil, type Oil } from "~~/db/schema";
import { z } from "zod";

const oilSchema = z.object({
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
    const body = await readBody<Oil>(event);
    const parsedOil = oilSchema.parse(body);
    const newOil = await db
      .insert(oil)
      .values({
        description: parsedOil.description,
        mfr_number: parsedOil.mfr_number,
        part_number: parsedOil.part_number,
        quantity: parsedOil.quantity,
        cost: parsedOil.cost,
        list: parsedOil.list,
        price: parsedOil.price,
        estimate_id: parsedOil.estimate_id,
      } as any)
      .returning()
      .then((res) => res[0]);

    return newOil;
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to create oil entry. " + error.message };
    }
    return { error: "Failed to create oil entry." };
  }
});
