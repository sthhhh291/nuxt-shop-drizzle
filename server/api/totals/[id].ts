import { db } from "~~/server/sqlite-service";
import { estimate_totals } from "~~/db/schema";
import { eq } from "drizzle-orm";

// Use the view for SELECT operations only
export default eventHandler(async (event) => {
  const id = event.context.params?.id;
  if (event.req.method === "GET") {
    if (!id) {
      event.res.statusCode = 400;
      return { error: "Missing id" };
    }

    // Use the generic select builder since db.query.<view> is not available
    const rows = await db
      .select()
      .from(estimate_totals)
      .where(eq(estimate_totals.id, Number(id)))
      .limit(1);

    const totals = rows[0] ?? null;
    return totals;
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
