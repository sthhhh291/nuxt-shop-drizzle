import { db } from "../sqlite-service";
import { customers, employees, type InsertEmployee } from "../../db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  if (event.req.method === "GET") {
    const allEmployees = await db
      .select({
        id: employees.id,
        customer_id: employees.customer_id,
        position: employees.position,
        hire_date: employees.hire_date,
        termination_date: employees.termination_date,
        first_name: customers.first_name,
        last_name: customers.last_name,
      })
      .from(employees)
      .leftJoin(customers, eq(employees.customer_id, customers.id));
    return allEmployees;
  } else {
    event.res.statusCode = 405;
    return { error: "Method not allowed" };
  }
});
