import { db } from "~~/server/sqlite-service";
import { labor } from "~~/db/schema";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";

export default defineEventHandler(async (event) => {
  try {
    interface LaborSeed {
      id?: string;
      estimate_id?: string;
      description?: string;
      hours?: number;
      rate?: number;
      price?: number;
    }
    const laborSeeds = parse(
      fs.readFileSync(
        path.resolve(process.cwd(), "app/lib/seeds/Labor.txt"),
        "utf-8"
      ),
      {
        columns: true,
        skip_empty_lines: true,
      }
    ) as LaborSeed[];

    console.log(`Parsed ${laborSeeds.length} labor entries from CSV.`);

    for (const laborEntry of laborSeeds) {
      try {
        const { id, estimate_id, description, hours, rate, price } = laborEntry;
        await db.insert(labor).values({
          id: id || undefined,
          estimate_id: estimate_id || "",
          description: description || "",
          hours: hours || 0,
          rate: rate || 0,
          price: price || 0,
        });
      } catch (laborError) {
        console.error("Error inserting labor entry:", laborError, "Labor data:", laborEntry);
      }
    }
  } catch (parseError) {
    console.error("Error parsing CSV:", parseError);
    throw parseError;
  }
});