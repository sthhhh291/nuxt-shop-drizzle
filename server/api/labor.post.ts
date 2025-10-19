import { db } from "../sqlite-service";
import { labor, type Labor } from "~~/db/schema";
import { z } from "zod";

const laborSchema = z.object({
  description: z.string(),
  hours: z.number(),
  rate: z.number(),
  estimate_id: z.number(),
  price: z.number().optional(),
});

export default eventHandler(async (event) => {
  try {
    const body = await readBody<Labor>(event);
    const parsedLabor = laborSchema.parse(body);
    const newLabor = await db
      .insert(labor)
      .values({
        description: parsedLabor.description,
        hours: parsedLabor.hours,
        rate: parsedLabor.rate,
        estimate_id: parsedLabor.estimate_id,
        price: parsedLabor.price ?? parsedLabor.hours * parsedLabor.rate,
      })
      .returning()
      .then((res) => res[0]);

    return newLabor;
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to create labor entry. " + error.message };
    }
    return { error: "Failed to create labor entry." };
  }
});
