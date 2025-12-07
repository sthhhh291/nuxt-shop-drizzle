import {db} from "~~/server/sqlite-service";
import {markupMatrix} from "~~/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const {id} = event.context.params as {id: string};

  const [deletedMarkup] = await db
    .delete(markupMatrix)
    .where(eq(markupMatrix.id, Number(id)))
    .returning();

  if (!deletedMarkup) {
    event.res.statusCode = 404;
    return { error: "Markup entry not found" };
  }

  return { message: "Markup entry deleted successfully", markup: deletedMarkup };

});