import { db } from "../sqlite-service";
import { parts } from "../../db/schema";
import { parse } from "csv-parse/sync";
import * as fs from "fs";

interface PartSeed {
  id: number;
  estimate_id: number;
  description: string;
  quantity: number;
  man_no: string;
  part_no: string;
  cost: number;
  price: number;
  warrranty: string;
}

// read and parse the sample parts data from Parts.txt
function loadPartSeeds(): PartSeed[] {
  const sampleParts: PartSeed[] = parse(
    fs.readFileSync("./server/utils/Parts.txt", "utf-8"),
    { columns: true, skip_empty_lines: true }
  ); 

  console.log(`Generated ${sampleParts.length} sample parts.`);
  return sampleParts;
}

//insert sample parts into the database
export async function seedParts() {
  const partSeeds = loadPartSeeds();
  
  if (partSeeds.length === 0) {
    console.log("No parts to seed");
    return { successCount: 0, errorCount: 0, total: 0 };
  }
  
  let successCount = 0;
  let errorCount = 0;

  for (const partEntry of partSeeds) {
    try {
      const { estimate_id, description, quantity, cost, price, warrranty ,man_no, part_no } = partEntry;
      
      await db.insert(parts).values({
        estimate_id,
        description,
        quantity,
        cost,
        unit_price: price,
        mfr_number: man_no,
        part_number: part_no,
        list: 0,
      });
      
      successCount++;
      if (successCount % 100 === 0) {
        console.log(`Processed ${successCount} parts...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`Error processing part ${partEntry.id}:`, error);
    }
  }

  console.log(`Parts seeding complete! Success: ${successCount}, Errors: ${errorCount}`);
  
  return {
    successCount,
    errorCount,
    total: partSeeds.length
  };
}