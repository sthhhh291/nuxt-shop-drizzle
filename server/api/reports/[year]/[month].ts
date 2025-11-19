import { db } from "~~/server/sqlite-service";
import { estimate_totals, labor, oil, parts } from "~~/db/schema";
import { sql } from "drizzle-orm";
// import {sql,eq} from 'drizzle-orm/sqlite-core'

export default defineEventHandler(async (event) => {
  const { month, year } = event.context.params as { month: string, year: string };
  

  // Extract month from string date field "1/1/2005 0:00:00" or "12/31/2005 0:00:00"
  // Parse the month parameter and create proper where clause
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  // Match month at the beginning of the date string
  // Handles both "1/" and "01/" formats, and "12/" etc.
  const whereClause = sql`
    CAST(SUBSTR(${estimate_totals.date}, 1, INSTR(${estimate_totals.date}, '/') - 1) AS INTEGER) = ${monthNum}
    AND ${estimate_totals.date} LIKE '%/' || ${year} || ' %'
  `;

  const totals = await db
    .select()
    .from(estimate_totals)
    .where(whereClause)
    .orderBy(estimate_totals.id);

  const sums = await db
    .select({
      month: sql<number>`${month}`,
      year: sql<number>`${year}`,
      labor: sql<number>`SUM(${labor})`,
      parts: sql<number>`SUM(${parts})`,
      oil: sql<number>`SUM(${oil})`,
      subtotal: sql<number>`SUM(${estimate_totals.subtotal})`,
      shop_fees: sql<number>`SUM(${estimate_totals.shop_fees})`,
      tax: sql<number>`SUM(${estimate_totals.tax})`,
      total: sql<number>`SUM(${estimate_totals.total})`,
      cost: sql<number>`SUM(${estimate_totals.cost})`,
      margin: sql<number>`SUM(${estimate_totals.margin})`,
      parts_margin: sql<number>`SUM(${estimate_totals.parts_margin})`,
    })
    .from(estimate_totals)
    .where(whereClause);

  return { totals, sums };
});
