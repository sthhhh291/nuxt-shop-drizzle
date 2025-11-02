import { db } from "~~/server/sqlite-service";
// import type { Oil } from "~~/db/schema";
import { oil } from "~~/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing oil ID" });
  }

  const oilEntry = await db.query.oil.findFirst({
    where: eq(oil.id, Number(id)),
  });

  if (!oilEntry) {
    throw createError({ statusCode: 404, statusMessage: "Oil not found" });
  }

  return oilEntry;
});
