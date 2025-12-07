import {db} from "../sqlite-service";
import {employees, type InsertEmployee} from "../../db/schema";

export default defineEventHandler(async (event) => {
  if (event.req.method === "GET") {
    const allEmployees = await db.select().from(employees);
    return allEmployees;
  } else {
    event.res.statusCode = 405;
    return { error: "Method not allowed" };
  }
});