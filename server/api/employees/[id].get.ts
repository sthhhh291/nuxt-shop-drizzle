import {db} from "~~/server/sqlite-service";
import {employees, type InsertEmployee} from "~~/db/schema";
import {eq} from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    event.res.statusCode = 400;
    return { error: "Employee ID is required" };
  }

  if (event.req.method === "GET") {
    const employee = await db.select().from(employees).where(eq(employees.id, Number(id))).limit(1).get();
    if (!employee) {
      event.res.statusCode = 404;
      return { error: "Employee not found" };
    }
    return employee;
  } else {
    event.res.statusCode = 405;
    return { error: "Method not allowed" };
  }
});