import { db } from "../sqlite-service";
import { estimates } from "~~/db/schema";
import { estimateSchema } from "~/lib/validations";

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
    };

    const insertedEstimate = await db
      .insert(estimates)
      .values(dbEstimate)
      .returning();

    return insertedEstimate[0];
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to create estimate. " + error.message };
    }
    return { error: "Failed to create estimate." };
  }
});
