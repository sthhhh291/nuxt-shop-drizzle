import { db } from "../sqlite-service";
import { customers } from "../../db/schema";
import { sql } from "drizzle-orm";
import { getPaginationParams, paginateQuery } from "../utils/pagination";

export default defineEventHandler(async (event) => {
  if (event.req.method === "GET") {
    const query = getQuery(event);
    const { page, limit, offset } = getPaginationParams(query);
    const search = (query.search as string) || "";
    
    // Create the search condition for reuse
    const searchCondition = sql`(first_name || ' ' || last_name) like ${'%' + search + '%'}`;
    
    // Create both queries
    const dataQuery = db.query.customers.findMany({
      where: searchCondition,
      with: {
        cars: {
          with: {
            estimates: { with: { labor: true, parts: true, oil: true } },
          },
        },
        phones: true,
        emails: true,
        addresses: true,
      },
      orderBy: (customers, { asc }) => asc(customers.last_name),
      limit: limit,
      offset: offset,
    });

    const countQuery = db.select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(searchCondition);

    // Use the pagination helper
    const result = await paginateQuery(dataQuery, countQuery, { page, limit });

    return {
      customers: result.data,
      pagination: result.pagination
    };
  } else {
    event.res.statusCode = 405;
    return { error: "Method not allowed" };
  }
});