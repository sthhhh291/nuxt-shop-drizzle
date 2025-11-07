// import type { User } from "../../db/schema";
// import { users } from "../../db/schema";
// import { db } from "../sqlite-service";

// export default defineEventHandler(async () => {
//   try {
//     const allUsers: User[] = await db.select().from(users).all();
//     return { allUsers };
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     throw createError({
//       statusCode: 500,
//       statusMessage: "Internal Server Error",
//     });
//   }
// });
