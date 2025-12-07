import { db } from "../sqlite-service";
import { adminPanel} from "../../db/schema";
import { adminSchema } from "../../app/lib/validations";

export default defineEventHandler(async (event) => {
  if (event.req.method === "GET") {
    const admins = await db
      .select()
      .from(adminPanel)
      .all();
    if (!admins || admins.length === 0) {
      event.res.statusCode = 400;
      return { error: "Invalid request",details: "No admin entries found" };
    }
    return admins;
  } else {
    event.res.statusCode = 405;
    return { error: "Method not allowed" };
  }
});