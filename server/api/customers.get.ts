import { db } from "../sqlite-service";
import { customers } from "../../db/schema";
import { z } from "zod";
import { like, or, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  if (event.req.method === "GET") {
    const query = getQuery(event);
    const page = Number(query.page || "1");
    const search = query.search || "";
    const limit = Number(query.limit || "20");
    const offset = (page - 1) * limit;

    // Create the search condition for reuse (SQLite compatible)
    const searchCondition =
      search ?
        or(
          like(customers.first_name, `%${search}%`),
          like(customers.last_name, `%${search}%`),
          sql`(${customers.first_name} || ' ' || ${customers.last_name}) like ${"%" + search + "%"}`
        )
      : undefined;

    // Run both queries in parallel for better performance
    const [allCustomers, totalCountResult] = await Promise.all([
      // Main query with pagination - only get basic customer info
      db
        .select({
          id: customers.id,
          first_name: customers.first_name,
          last_name: customers.last_name,
          notes: customers.notes,
        })
        .from(customers)
        .where(searchCondition)
        .orderBy(customers.last_name)
        .limit(limit)
        .offset(offset),

      // Count query for total records
      db
        .select({ count: sql<number>`count(*)` })
        .from(customers)
        .where(searchCondition),
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
        offset,
      },
    };
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
