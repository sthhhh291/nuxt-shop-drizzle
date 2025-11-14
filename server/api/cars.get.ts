import { db } from "../sqlite-service";
import { cars } from "../../db/schema";
import {sql,like,or, desc, asc} from "drizzle-orm";
// import { /z } from "zod";

export default eventHandler(async (event) => {
  try {
    const  query = getQuery(event);
    const search = query.search || "";
    const page = Number(query.page || "1");
    const limit = Number(query.limit || "20");
    const offset = (page - 1) * limit;
    const where = sql`(year || ' ' || make || ' ' || model) LIKE ${"%" + search + "%"}`;
    //runs both queries in parallel for better performance
    const [allCars, totals] = await Promise.all([
      db.select().from(cars).where(where).limit(limit).offset(offset).orderBy(desc(cars.year), asc(cars.make), asc(cars.model)),
      db.select({ count: sql<number>`count(*)` }).from(cars).where(where)
    ]);
    const totalCount = totals[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const pagination = {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage,
      hasPreviousPage,
    };
    // event.res.setHeader("X-Pagination", JSON.stringify(pagination));
    return { cars:allCars, pagination };
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to retrieve cars." + error.message };
    }
    return { error: "Failed to retrieve cars." };
  }
});
