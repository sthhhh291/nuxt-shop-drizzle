import { db } from "../sqlite-service";
import { markupMatrix } from "../../db/schema";
import { markupSchema } from "~/lib/validations";

export default defineEventHandler(async (event) => {
  if (event.req.method === "POST") {
    const body = await readBody(event);
    const parsedBody = markupSchema.safeParse(body);

    if (!parsedBody.success) {
      event.res.statusCode = 400;
      return { error: "Invalid request", details: parsedBody.error.format() };
    }

    const { value,multiplier } = parsedBody.data;
    const [newMarkup] = await db
      .insert(markupMatrix)
      .values({ value,multiplier })
      .returning();

    return { message: "Markup created successfully", markup: newMarkup };
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});