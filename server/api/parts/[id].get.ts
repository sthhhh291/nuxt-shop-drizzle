import { db } from "~~/server/sqlite-service";
import { parts } from "~~/db/schema";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  try {
    if (event.method === "GET") {
      const id = event.context.params?.id;
      if (!id) {
        event.res.statusCode = 400;
        return { error: "Part ID is required." };
      }
      const part = await db.query.parts.findFirst({
        where: eq(parts.id, Number(id)),
      });
      if (!part) {
        event.res.statusCode = 404;
        return { error: "Part not found." };
      }
      return part;
    }
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to retrieve part entry. " + error.message };
    }
    return { error: "Failed to retrieve part entry." };
  }
});
