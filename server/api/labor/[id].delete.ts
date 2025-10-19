import { db } from "~~/server/sqlite-service";
import { labor } from "~~/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

const paramsSchema = z.object({
  id: z.string().transform((val) => {
    const parsed = Number(val);
    if (isNaN(parsed)) {
      throw new Error("Invalid labor id.");
    }
    return parsed;
  }),
});

export default eventHandler(async (event) => {
  const params = event.context.params;

  try {
    const { id } = paramsSchema.parse(params);

    const deletedCount = await db.delete(labor).where(eq(labor.id, id)).run();
    return { message: "Labor entry deleted successfully", deletedCount };
  } catch (error: unknown) {
    event.res.statusCode = 500;
    if (error instanceof Error) {
      return { error: "Failed to delete labor entry. " + error.message };
    }
    return { error: "Failed to delete labor entry." };
  }
});
