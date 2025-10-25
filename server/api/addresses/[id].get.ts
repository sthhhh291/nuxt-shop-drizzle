import { db } from "~~/server/sqlite-service";
import { addresses } from "~~/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid address ID",
    });
  }

  const address = await db.query.addresses.findFirst({
    where: eq(addresses.id, Number(id)),
  });

  if (!address) {
    throw createError({
      statusCode: 404,
      statusMessage: "Address not found",
    });
  }

  return address;
});
