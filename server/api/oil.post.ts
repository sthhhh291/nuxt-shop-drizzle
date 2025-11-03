import { db } from "../sqlite-service";
import { oil, type Oil } from "~~/db/schema";
import { z } from "zod";

const oilSchema = z.object({
  type: z.string(),
  mfr_number: z.string().optional(),
  part_number: z.string().optional(),
  quantity: z.number(),
  cost: z.number(),
  list: z.number(),
  price_per_unit: z.number(),
  estimate_id: z.number(),
});

export default eventHandler(async (event) => {
  try {
    const body = await readBody<Oil>(event);
    const parsedOil = oilSchema.parse(body);
    const newOil = await db
      .insert(oil)
      .values({
        type: parsedOil.type,
        mfr_number: parsedOil.mfr_number,
        part_number: parsedOil.part_number,
        quantity: parsedOil.quantity,
        cost: parsedOil.cost,
        list: parsedOil.list,
        price_per_unit: parsedOil.price_per_unit,
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
