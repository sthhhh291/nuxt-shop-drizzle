import { db } from "../sqlite-service";
import { type Estimate, estimates } from "~~/db/schema";
import { sql } from "drizzle-orm";

export default eventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = Number(query.page || "1");
    const limit = Number(query.limit || "20");
    const offset = (page - 1) * limit;
    const search = query.search || ""; // Currently unused, but can be implemented later
    const [estimatesList, totalCountResult] = await Promise.all([
      db.select().from(estimates).limit(limit).offset(offset).orderBy(estimates.date),
      db.select({ count: sql<number>`count(*)` }).from(estimates)
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
