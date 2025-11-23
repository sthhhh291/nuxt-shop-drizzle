import { db } from "../sqlite-service";
import { type Estimate, estimates, labor, parts, oil, cars, customers } from "~~/db/schema";
import { sql, or, like, inArray, eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = Number(query.page || "1");
    const limit = Number(query.limit || "20");
    const offset = (page - 1) * limit;
    const search = query.search || "";
    
    if (search) {
      const searchPattern = `%${search}%`;
      
      // Get distinct estimate IDs that match the search using subqueries
      const laborMatches = db
        .selectDistinct({ estimate_id: labor.estimate_id })
        .from(labor)
        .where(like(labor.description, searchPattern));
      
      const partsMatches = db
        .selectDistinct({ estimate_id: parts.estimate_id })
        .from(parts)
        .where(like(parts.description, searchPattern));
      
      const oilMatches = db
        .selectDistinct({ estimate_id: oil.estimate_id })
        .from(oil)
        .where(like(oil.type, searchPattern));
      
      const notesMatches = db
        .select({ estimate_id: estimates.id })
        .from(estimates)
        .where(
          or(
            like(estimates.public_notes, searchPattern),
            like(estimates.private_notes, searchPattern)
          )
        );
      
      // Search by car (year make model)
      const carMatches = db
        .select({ estimate_id: estimates.id })
        .from(estimates)
        .innerJoin(cars, eq(estimates.car_id, cars.id))
        .where(
          sql`(${cars.year} || ' ' || ${cars.make} || ' ' || ${cars.model}) LIKE ${searchPattern}`
        );
      
      // Search by customer (first name + last name)
      const customerMatches = db
        .select({ estimate_id: estimates.id })
        .from(estimates)
        .innerJoin(cars, eq(estimates.car_id, cars.id))
        .innerJoin(customers, eq(cars.customer_id, customers.id))
        .where(
          sql`(${customers.first_name} || ' ' || ${customers.last_name}) LIKE ${searchPattern}`
        );
      
      // Execute all searches in parallel
      const [laborIds, partsIds, oilIds, notesIds, carIds, customerIds] = await Promise.all([
        laborMatches,
        partsMatches,
        oilMatches,
        notesMatches,
        carMatches,
        customerMatches
      ]);
      
      // Combine all matching estimate IDs
      const allIds = new Set([
        ...laborIds.map(r => r.estimate_id),
        ...partsIds.map(r => r.estimate_id),
        ...oilIds.map(r => r.estimate_id),
        ...notesIds.map(r => r.estimate_id),
        ...carIds.map(r => r.estimate_id),
        ...customerIds.map(r => r.estimate_id)
      ]);
      
      const estimateIds = Array.from(allIds);
      
      if (estimateIds.length === 0) {
        return {
          estimates: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalCount: 0,
            limit,
            hasNextPage: false,
            hasPreviousPage: false,
            offset,
          },
        };
      }
      
      // Get paginated results
      const [estimatesList, totalCountResult] = await Promise.all([
        db.select()
          .from(estimates)
          .where(inArray(estimates.id, estimateIds))
          .limit(limit)
          .offset(offset)
          .orderBy(estimates.date),
        db.select({ count: sql<number>`count(*)` })
          .from(estimates)
          .where(inArray(estimates.id, estimateIds))
      ]);
      
      const totalCount = totalCountResult[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        estimates: estimatesList,
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
    }
    
    // No search - use simple query
    const [estimatesList, totalCountResult] = await Promise.all([
      db.select()
        .from(estimates)
        .limit(limit)
        .offset(offset)
        .orderBy(estimates.date),
      db.select({ count: sql<number>`count(*)` })
        .from(estimates)
    ]);
    
    const totalCount = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      estimates: estimatesList,
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
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to retrieve estimates. " + error.message };
    }
    return { error: "Failed to retrieve estimates." };
  }
});
