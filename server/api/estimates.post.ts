import { db } from "../sqlite-service";
import { type Estimate, estimates } from "~~/db/schema";

export default eventHandler(async (event) => {
  try {
    const body = await readBody<Estimate>(event);

    const insertedEstimate = await db
      .insert(estimates)
      .values({
        date: body.date,
        hours_taken: body.hours_taken,
        miles: body.miles,
        estimate_type: body.estimate_type,
        private_notes: body.private_notes,
        public_notes: body.public_notes,
        car_id: body.car_id,
      })
      .returning()
      .then((res) => res[0]);

    return insertedEstimate;
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to create estimate. " + error.message };
    }
    return { error: "Failed to create estimate." };
  }
});
