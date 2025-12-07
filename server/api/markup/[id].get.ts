import {db} from "~~/server/sqlite-service";
import {markupMatrix} from "~~/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const {id} = event.context.params as {id: string};

  const markupEntry = await db
    .select()
    .from(markupMatrix)
    .where(eq(markupMatrix.id, Number(id)))
    .limit(1)
    .get();

  if (!markupEntry) {
    event.res.statusCode = 404;
    return {error: "Markup entry not found"};
  }

  return markupEntry;
});