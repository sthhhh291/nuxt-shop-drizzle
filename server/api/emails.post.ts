import { db } from "../sqlite-service";
import { emails } from "~~/db/schema";

export default defineEventHandler(async (event) => {
  if (event.req.method === "POST") {
    const emailData = await readBody(event);

    const [email] = await db.insert(emails).values(emailData).returning();

    return { email };
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
