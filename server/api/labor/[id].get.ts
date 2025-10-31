import { db } from "~~/server/sqlite-service";
import type { Labor } from "~~/db/schema";
import { labor } from "~~/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing labor ID" });
  }

  const laborEntry = await db.query.labor.findFirst({
    where: eq(labor.id, Number(id)),
  });

  if (!laborEntry) {
    throw createError({ statusCode: 404, statusMessage: "Labor not found" });
  }

  return laborEntry;
});
