import { db } from "~~/server/sqlite-service";
import { parts } from "~~/db/schema";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    if (!id) {
      event.res.statusCode = 400;
      return { error: "Part ID is required." };
    }

    const deletedCount = await db
      .delete(parts)
      .where(eq(parts.id, Number(id)))
      .returning()
      .then((res) => res.length);

    if (deletedCount === 0) {
      event.res.statusCode = 404;
      return { error: "Part not found." };
    }

    return { message: "Part deleted successfully." };
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to delete part entry. " + error.message };
    }
    return { error: "Failed to delete part entry." };
  }
});
