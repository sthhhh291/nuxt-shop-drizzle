import { db } from "~~/server/sqlite-service";
import { estimates, type Estimate } from "~~/db/schema";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const params = event.context.params;
  const id = params?.id ? parseInt(params.id) : null;

  if (id === null || isNaN(id)) {
    event.res.statusCode = 400;
    return { error: "Invalid or missing estimate id." };
  }

  try {
    const body = await readBody<Estimate>(event);

    const updatedEstimate = await db
      .update(estimates)
      .set({
        date: body.date,
        hours_taken: body.hours_taken,
        miles: body.miles,
        estimate_type: body.estimate_type,
        private_notes: body.private_notes,
        public_notes: body.public_notes,
        car_id: body.car_id,
      })
      .where(eq(estimates.id, id))
      .returning()
      .then((res) => res[0]);

    return updatedEstimate;
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to update estimate. " + error.message };
    }
    return { error: "Failed to update estimate." };
  }
});
