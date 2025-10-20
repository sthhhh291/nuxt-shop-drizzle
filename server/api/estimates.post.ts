import { db } from "../sqlite-service";
import { estimates } from "~~/db/schema";
import { z } from "zod";

const estimateSchema = z.object({
  date: z.string().min(10).max(10),
  hours_taken: z.number().min(0),
  miles: z.number().min(0),
  estimate_type: z.enum(["initial", "estimate", "repair_order"]),
  private_notes: z.string().max(500).optional(),
  public_notes: z.string().max(500).optional(),
  car_id: z.number().int().positive(),
});

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const parsed = estimateSchema.safeParse(body);

    if (!parsed.success) {
      event.res.statusCode = 400;
      return { error: "Invalid request body", details: parsed.error.format() };
    }
    const validatedBody = parsed.data;

    // Ensure optional fields are always strings
    const dbEstimate = {
      ...validatedBody,
      private_notes: validatedBody.private_notes ?? "",
      public_notes: validatedBody.public_notes ?? "",
      // car_id: Number(validatedBody.car_id), // convert car_id to number
    };

    const insertedEstimate = await db
      .insert(estimates)
      .values(dbEstimate)
      .returning();

    return insertedEstimate;
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to create estimate. " + error.message };
    }
    return { error: "Failed to create estimate." };
  }
});
