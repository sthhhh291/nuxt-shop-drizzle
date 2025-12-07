import { db } from "../sqlite-service";
import { markupMatrix } from "../../db/schema";
import { markupSchema } from "~/lib/validations";

export default defineEventHandler(async (event) => {
  if (event.req.method === "GET") {
    const allMarkups = await db.select().from(markupMatrix);
    return allMarkups;
  } 
  else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});