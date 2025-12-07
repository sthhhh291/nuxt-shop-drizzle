import {db} from "~~/server/sqlite-service";
import {employees, type InsertEmployee} from "~~/db/schema";
import {eq} from "drizzle-orm";
import { H3Event, EventHandlerRequest } from "h3";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    event.res.statusCode = 400;
    return { error: "Employee ID is required" };
  }
  if (event.req.method === "PUT") {
    const body = await readBody<Partial<InsertEmployee>>(event);
    try {
      await db
        .update(employees)
        .set(body)
        .where(eq(employees.id, Number(id)));
      const updatedEmployee = await db
        .select()
        .from(employees)
        .where(eq(employees.id, Number(id)))
        .limit(1)
        .get();
      if (!updatedEmployee) {
        event.res.statusCode = 404;
        return { error: "Employee not found" };
      }
      return updatedEmployee;
    } catch (error) {
      event.res.statusCode = 500;
      return { error: "Failed to update employee" };
    }
  } else {
    event.res.statusCode = 405;
    return { error: "Method not allowed" };
  }
});
