import {db} from "~~/server/sqlite-service";
import {employees, type InsertEmployee} from "~~/db/schema";
import {eq} from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    event.res.statusCode = 400;
    return { error: "Employee ID is required" };
  }
  if (event.req.method === "DELETE") {
    try {
      const deleteResult = await db
        .delete(employees)
        .where(eq(employees.id, Number(id)));
      if (deleteResult.rowsAffected === 0) {
        event.res.statusCode = 404;
        return { error: "Employee not found" };
      }
      return { message: "Employee deleted successfully" };
    } catch (error) {
      event.res.statusCode = 500;
      return { error: "Failed to delete employee" };
    }
  } else {
    event.res.statusCode = 405;
    return { error: "Method not allowed" };
  }
});