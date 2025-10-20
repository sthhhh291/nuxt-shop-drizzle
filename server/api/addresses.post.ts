import { db } from "../sqlite-service";
import { addresses } from "~~/db/schema";

export default defineEventHandler(async (event) => {
  if (event.node.req.method === "POST") {
    const addressData = await readBody(event);

    const [address] = await db
      .insert(addresses)
      .values(addressData)
      .returning();

    return { address };
  } else {
    event.node.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
