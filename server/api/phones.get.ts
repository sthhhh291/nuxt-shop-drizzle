import { db } from "../sqlite-service";
import { phones } from "../../db/schema";
// import { z } from "zod";

// const phoneSchema = z.object({
//   id: z.string().uuid(),
//   number: z.string().min(10).max(15),
//   type: z.enum(["mobile", "landline"]),
//   userId: z.string().uuid(),
// });

export default eventHandler(async (event) => {
  if (event.req.method === "GET") {
    const allPhones = await db.select().from(phones);
    return allPhones;
  } else {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: "Method not allowed" };
  }
});
