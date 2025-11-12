import {db} from "../sqlite-service";
import {employees, type InsertEmployee} from "../../db/schema";
import {sql} from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {customer_id, position, hire_date, termination_date} = body;

  const employee: InsertEmployee = {
    customer_id,
    position,
    hire_date,
    termination_date,
  };

  const [id] = await db.insert(employees).values(employee).returning({ id: employees.id });

  return { id };
});