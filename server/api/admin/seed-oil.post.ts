import { db } from "~~/server/sqlite-service";
import { oil } from "~~/db/schema";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";

export default defineEventHandler(async (event) => {
  try {
    interface OilSeed {
      id?: string;
      estimate_id?: string;
      description?: string;
      quantity?: number;
      price?: number;
    //   total_price?: number;
    }
    const oilSeeds = parse(
      fs.readFileSync(
        path.resolve(process.cwd(), "app/lib/seeds/Oil.txt"),
        "utf-8"
      ),
      {
        columns: true,
        skip_empty_lines: true,
      }
    ) as OilSeed[];

    console.log(`Parsed ${oilSeeds.length} oil entries from CSV.`);

    for (const oilEntry of oilSeeds) {
      try {
        const { id, estimate_id, description, quantity, price } = oilEntry;
        await db.insert(oil).values({
          id: id || undefined,
          estimate_id: estimate_id || "",
          type: description || "",
          quantity: quantity || 0,
          price_per_unit: price || 0,
          cost: 0,
        });
      } catch (oilError) {
        console.error("Error inserting oil entry:", oilError, "Oil data:", oilEntry);
      }
    }
  } catch (parseError) {
    console.error("Error parsing CSV:", parseError);
    throw parseError;
  }
});