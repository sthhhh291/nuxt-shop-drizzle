import { db } from "../sqlite-service";
import { cars, customers, customersRelations } from "../../db/schema";
import { z } from "zod";
import { ilike, like, or, sql} from "drizzle-orm";

const customerSchema = z.object({
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  notes: z.string().max(255).optional(),
});

export default defineEventHandler(async (event) => {
  if (event.req.method === "GET") {
    const query = getQuery(event);
    const page = Number(query.page || "1");
    const search = query.search || "";
    const limit = 20;
    const offset = (page - 1) * limit;
    
    // Create the search condition for reuse
    const searchCondition = sql`(first_name || ' ' || last_name) like ${'%' + search + '%'}`;
    
    // Run both queries in parallel for better performance
    const [allCustomers, totalCountResult] = await Promise.all([
      // Main query with pagination
      db.query.customers.findMany({
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
      }),
      
      // Count query for total records
      db.select({ count: sql<number>`count(*)` })
        .from(customers)
        .where(searchCondition)
    ]);

    const totalCount = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      customers: allCustomers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPreviousPage,
        offset
      }
    };
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
