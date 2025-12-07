import {db} from "~~/server/sqlite-service";
import { adminPanel } from "~~/db/schema";
import { adminSchema } from "~~/app/lib/validations";

export default defineEventHandler(async (event) => {
  if (event.req.method === "PUT") {
    const body = await readBody(event);
    const parsedBody = adminSchema.safeParse(body);

    if (!parsedBody.success) {
      event.res.statusCode = 400;
      return { error: "Invalid request", details: parsedBody.error.format() };
    }

    const { tax, labor_rate, shop_fee_threshold, shop_fee_rate } = parsedBody.data;

    const [updatedAdmin] = await db
      .update(adminPanel)
      .set({ tax, labor_rate, shop_fee_threshold, shop_fee_rate })
      .returning();

    return { message: "Admin updated successfully", admin: updatedAdmin };
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});