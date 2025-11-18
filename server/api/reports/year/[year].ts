import {db} from '~~/server/sqlite-service'
import {estimate_totals, labor, oil, parts} from '~~/db/schema'
import { sql } from 'drizzle-orm'
// import {sql,eq} from 'drizzle-orm/sqlite-core'

export default defineEventHandler(async (event) => {
  const {year} = event.context.params as {year: string}

  // Extract 4-digit year from string date field "1/1/2005 0:00:00" or "12/31/2005 0:00:00"
  // Use LIKE pattern to match the year in MM/DD/YYYY format
  const whereClause = sql`${estimate_totals.date} LIKE '%/' || ${year} || ' %'`


  const totals = await db.select().from(estimate_totals)
    .where(whereClause)
    .orderBy(estimate_totals.id)

    const sums = await db.select({
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
        }).from(estimate_totals)
        .where(whereClause)

  return { totals, sums }
})