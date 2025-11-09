import { db } from "~~/server/sqlite-service"
import { parts } from "~~/db/schema"
import { parse } from "csv-parse/sync"
import * as fs from "fs"
import * as path from "path"

export default defineEventHandler(async (event) => {
  try {
    interface PartSeed {
      id?: string
      estimate_id?: string
      description?: string
      quantity?: number
      cost?: number
      price?: number
        mfr_no?: string
      part_no?: string
    }
    const partSeeds = parse(
      fs.readFileSync(
        path.resolve(process.cwd(), "app/lib/seeds/Parts.txt"),
        "utf-8"
      ),
      {
        columns: true,
        skip_empty_lines: true,
      }
    ) as PartSeed[];

    console.log(`Parsed ${partSeeds.length} part entries from CSV.`);

    for (const partEntry of partSeeds) {
      try {
        const { id, estimate_id, description, quantity, cost, price, mfr_no, part_no } = partEntry;
        await db.insert(parts).values({
          id: id || undefined,
          estimate_id: estimate_id || "",
          description: description || "",
          quantity: quantity || 0,
          cost: cost || 0,
          unit_price: price || 0,
          mfr_number: mfr_no || "",
          part_number: part_no || "",
          list: 0,
        });
      } catch (partError) {
        console.error("Error inserting part entry:", partError, "Part data:", partEntry);
      }
    }
  } catch (parseError) {
    console.error("Error parsing CSV:", parseError);
    throw parseError;
  }
});