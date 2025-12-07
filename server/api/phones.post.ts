import { db } from "../sqlite-service";
import { phones } from "../../db/schema";
import { phoneSchemaWithCustomer } from "../../app/lib/validations";

export default defineEventHandler(async (event) => {
  if (event.req.method === "POST") {
    const body = await readBody(event);
    const parsedBody = phoneSchemaWithCustomer.safeParse(body);

    if (!parsedBody.success) {
      event.res.statusCode = 400;
      return { error: "Invalid request", details: parsedBody.error.format() };
    }

    const { phone_number, phone_type, customer_id } = parsedBody.data;

    const [newPhone] = await db
      .insert(phones)
      .values({ phone_number, phone_type, customer_id })
      .returning();

    return { message: "Phone created successfully", phone: newPhone };
  } else if (event.req.method === "GET") {
    const allPhones = await db.select().from(phones);
    return { phones: allPhones };
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
