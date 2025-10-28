import { db } from "../sqlite-service";
import { estimate_totals } from "../../db/schema";
// Use the view for SELECT operations only
export default eventHandler(async (event) => {
  if (event.req.method === "GET") {
    const totals = await db.select().from(estimate_totals);
    return totals;
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
