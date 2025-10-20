import { db } from "~~/server/sqlite-service";
import { estimates, labor, parts, oil } from "~~/db/schema";
import { z } from "zod";
import { eq, sql, sum } from "drizzle-orm";

const paramsSchema = z.object({
  id: z.string().transform((val) => {
    const parsed = Number(val);
    if (isNaN(parsed)) {
      throw new Error("Invalid estimate id.");
    }
    return parsed;
  }),
});

export default eventHandler(async (event) => {
  const params = event.context.params;

  try {
    const { id } = paramsSchema.parse(params);

    const estimate = await db.query.estimates.findFirst({
      where: eq(estimates.id, id),
      with: {
        labor: true,
        parts: true,
        oil: true,
        car: {
          with: {
            customer: { with: { addresses: true, emails: true, phones: true } },
          },
        },
      },
    });

    if (!estimate) {
      event.res.statusCode = 404;
      return { error: "Estimate not found." };
    }

    const laborTotal = db
      .select({
        labor_total: sum(labor.price),
      })
      .from(labor)
      .where(eq(labor.estimate_id, id))
      .then((res) => res[0].labor_total || 0);

    const partsTotal = db
      .select({
        parts_total: sum(parts.unit_price),
      })
      .from(parts)
      .where(eq(parts.estimate_id, id))
      .then((res) => res[0].parts_total || 0);

    const oilTotal = db
      .select({
        oil_total: sum(oil.price_per_unit),
      })
      .from(oil)
      .where(eq(oil.estimate_id, id))
      .then((res) => res[0].oil_total || 0);
    const totals = { laborTotal, partsTotal, oilTotal };

    return { estimate, totals };
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to retrieve estimate. " + error.message };
    }
    return { error: "Failed to retrieve estimate." };
  }
});
