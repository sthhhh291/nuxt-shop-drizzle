import { db } from "~~/server/sqlite-service";
import { phones } from "~~/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing phone ID" });
  }

  const phone = await db.query.phones.findFirst({
    where: eq(phones.id, Number(id)),
  });

  if (!phone) {
    throw createError({ statusCode: 404, statusMessage: "Phone not found" });
  }

  return { phone };
});
