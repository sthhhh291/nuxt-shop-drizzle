import { db } from "../sqlite-service";
import { customers } from "../../db/schema";
import { sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page || "1");
  const search = query.search || "";
  const limit = 20;
  const offset = (page - 1) * limit;
  
  // Single query using window functions to get both data and total count
  const customersWithCount = await db
    .select({
      id: customers.id,
      first_name: customers.first_name,
      last_name: customers.last_name,
      notes: customers.notes,
      // Use COUNT() OVER() to get total count in each row
      totalCount: sql<number>`COUNT(*) OVER()`.as('total_count')
    })
    .from(customers)
    .where(sql`(first_name || ' ' || last_name) like ${'%' + search + '%'}`)
    .orderBy(customers.last_name)
    .limit(limit)
    .offset(offset);

  // Extract total count from first row (all rows have the same total)
  const totalCount = customersWithCount[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Remove totalCount from the customer objects
  const cleanCustomers = customersWithCount.map(({ totalCount, ...customer }) => customer);

  return {
    customers: cleanCustomers,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      offset
    }
  };
});