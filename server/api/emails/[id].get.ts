import { db } from "~~/server/sqlite-service";
import { emails } from "~~/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const idSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

export default defineEventHandler(async (event) => {
  const { id } = event.context.params || {};

  const parsedId = idSchema.safeParse({ id });

  if (!parsedId.success) {
    event.res.statusCode = 400;
    return { error: "Invalid ID", details: parsedId.error.format() };
  }

  const emailId = parsedId.data.id;

  if (event.req.method === "GET") {
    const email = await db.query.emails.findFirst({
      where: eq(emails.id, emailId),
    });
    if (!email) {
      event.res.statusCode = 404;
      return { error: "Email not found" };
    }

    return email;
  } else {
  }
});
