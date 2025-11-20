import { db } from "../sqlite-service";
import { cars, customers } from "../../db/schema";
import {sql,like,or, desc, asc, eq} from "drizzle-orm";
// import { /z } from "zod";

export default eventHandler(async (event) => {
  try {
    const  query = getQuery(event);
    const search = query.search || "";
    const page = Number(query.page || "1");
    const limit = Number(query.limit || "20");
    const offset = (page - 1) * limit;
    
    // Enhanced search to include customer names and car details
    const where = search 
      ? or(
          sql`(${cars.year} || ' ' || ${cars.make} || ' ' || ${cars.model}) LIKE ${"%" + search + "%"}`,
          sql`(${customers.first_name} || ' ' || ${customers.last_name}) LIKE ${"%" + search + "%"}`,
          like(cars.vin, `%${search}%`),
          like(cars.license, `%${search}%`),
          like(cars.fleet, `%${search}%`)
        )
      : undefined;
    
    //runs both queries in parallel for better performance
    const [allCars, totals] = await Promise.all([
      db.select({
        id: cars.id,
        make: cars.make,
        model: cars.model,
        year: cars.year,
        engine: cars.engine,
        vin: cars.vin,
        license: cars.license,
        fleet: cars.fleet,
        notes: cars.notes,
        customer_id: cars.customer_id,
        customer_first_name: customers.first_name,
        customer_last_name: customers.last_name,
      })
      .from(cars)
      .innerJoin(customers, eq(cars.customer_id, customers.id))
      .where(where)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(cars.year), asc(cars.make), asc(cars.model)),
      
      db.select({ count: sql<number>`count(*)` })
      .from(cars)
      .innerJoin(customers, eq(cars.customer_id, customers.id))
      .where(where)
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
