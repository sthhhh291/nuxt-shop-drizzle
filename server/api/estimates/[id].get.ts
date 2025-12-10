import { db } from "~~/server/sqlite-service";
import { estimates, labor, parts, oil,adminPanel } from "~~/db/schema";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";

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

    //totals calculation
    const totalsResult = await db
      .select({
        labor: sql<number>`coalesce(labor_sum.labor, 0)`,
        parts: sql<number>`coalesce(parts_sum.parts, 0)`,
        oil: sql<number>`coalesce(oil_sum.oil, 0)`,
        subtotal: sql<number>`coalesce(labor_sum.labor, 0) + coalesce(parts_sum.parts, 0) + coalesce(oil_sum.oil, 0)`,
        tax: sql<number>`round(tax * (coalesce(parts_sum.parts, 0) + coalesce(oil_sum.oil, 0)), 2)`,
        shop_fees: sql<number>`
          case 
            when (coalesce(labor_sum.labor, 0) + coalesce(parts_sum.parts, 0) + coalesce(oil_sum.oil, 0)) > 500 
            then shop_fee_threshold
            else round(shop_fee_rate * (coalesce(labor_sum.labor, 0) + coalesce(parts_sum.parts, 0) + coalesce(oil_sum.oil, 0)), 2) 
          end
        `,
        total: sql<number>`
          coalesce(labor_sum.labor, 0) + coalesce(parts_sum.parts, 0) + coalesce(oil_sum.oil, 0) + 
          round(tax * (coalesce(parts_sum.parts, 0) + coalesce(oil_sum.oil, 0)), 2) +
          case 
            when (coalesce(labor_sum.labor, 0) + coalesce(parts_sum.parts, 0) + coalesce(oil_sum.oil, 0)) > 500 
            then shop_fee_threshold
            else round(shop_fee_rate * (coalesce(labor_sum.labor, 0) + coalesce(parts_sum.parts, 0) + coalesce(oil_sum.oil, 0)), 2) 
          end
        `,
        cost: sql<number>`coalesce(parts_sum.p_cost, 0) + coalesce(oil_sum.o_cost, 0)`,
        margin: sql<number>`
          coalesce(labor_sum.labor, 0) + coalesce(parts_sum.parts, 0) + coalesce(oil_sum.oil, 0) + 
          case 
            when (coalesce(labor_sum.labor, 0) + coalesce(parts_sum.parts, 0) + coalesce(oil_sum.oil, 0)) > 500 
            then shop_fee_threshold
            else round(shop_fee_rate * (coalesce(labor_sum.labor, 0) + coalesce(parts_sum.parts, 0) + coalesce(oil_sum.oil, 0)), 2) 
          end
          - coalesce(parts_sum.p_cost, 0) - coalesce(oil_sum.o_cost, 0)
        `,
        parts_margin: sql<number>`coalesce(parts_sum.parts, 0) - coalesce(parts_sum.p_cost, 0)`,
      })
      .from(
        sql`(select coalesce(sum(price), 0) as labor from ${labor} where estimate_id = ${id}) as labor_sum`
      )
      .crossJoin(
        sql`(select coalesce(sum(unit_price * quantity), 0) as parts, coalesce(sum(cost * quantity), 0) as p_cost from ${parts} where estimate_id = ${id}) as parts_sum`
      )
      .crossJoin(
        sql`(select coalesce(sum(price_per_unit * quantity), 0) as oil, coalesce(sum(cost * quantity), 0) as o_cost from ${oil} where estimate_id = ${id}) as oil_sum`
      )
      .crossJoin(adminPanel)
      .get();

    return { estimate, totals: totalsResult };
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to retrieve estimate. " + error.message };
    }
    return { error: "Failed to retrieve estimate." };
  }
});
