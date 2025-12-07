import {db} from "~~/server/sqlite-service";
import {markupMatrix} from "~~/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const {id} = event.context.params as {id: string};

  const body = await readBody(event);
  const { value, multiplier } = body;
  const markupEntry = await db
    .update(markupMatrix)
    .set({ value, multiplier })
    .where(eq(markupMatrix.id, Number(id)))
    .returning()
    .get();

  if (!markupEntry) {
    event.res.statusCode = 404;
    return { error: "Markup entry not found" };
  }

  return { message: "Markup entry updated successfully", markup: markupEntry };

});