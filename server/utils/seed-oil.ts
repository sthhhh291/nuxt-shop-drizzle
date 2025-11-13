import { db } from "../sqlite-service";
import { oil } from "../../db/schema";
import { parse } from "csv-parse/sync";
import * as fs from "fs";

interface OilSeed {
  id: number;
  estimate_id: number;
  description: string;
  quantity: number;
  price: number;
}
// id,estimate_id,quantity,description,price

function loadOilSeeds(): OilSeed[] {
  const sampleOil: OilSeed[] = parse(
    fs.readFileSync("./server/utils/oil.txt", "utf-8"),
    { columns: true, skip_empty_lines: true }
  );

  console.log(`Generated ${sampleOil.length} sample oil entries.`);
  return sampleOil;
}

export async function seedOil() {
  const oilSeeds = loadOilSeeds();
  
  if (oilSeeds.length === 0) {
    console.log("No oil entries to seed");
    return { successCount: 0, errorCount: 0, total: 0 };
  }
  
  let successCount = 0;
  let errorCount = 0;

  for (const oilEntry of oilSeeds) {
    try {
      const { estimate_id, description, quantity, price, id } = oilEntry;
      
      await db.insert(oil).values({
        id,
        estimate_id,
        type: description,
        quantity,
        price_per_unit: price,
        cost:0,
      });
      
      successCount++;
      if (successCount % 100 === 0) {
        console.log(`Processed ${successCount} oil entries...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`Error processing oil entry ${oilEntry.description}:`, error);
    }
  }

  console.log(`Oil seeding complete! Success: ${successCount}, Errors: ${errorCount}`);
  
  return {
    successCount,
    errorCount,
    total: oilSeeds.length
  };
}