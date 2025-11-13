import { db } from "../sqlite-service";
import { labor } from "../../db/schema";
import { parse } from "csv-parse/sync";
import * as fs from "fs";

interface LaborSeed {
  id:number;
  estimate_id: number;
  description: string;
  // hours: number;
  // rate: number;
  price: number;
}

// id,estimate_id,pass,description,price
function loadLaborSeeds(): LaborSeed[] {
  const sampleLabor: LaborSeed[] = parse(
    fs.readFileSync("./server/utils/Labor.txt", "utf-8"),
    { columns: true, skip_empty_lines: true }
  );

  console.log(`Generated ${sampleLabor.length} sample labor entries.`);
  return sampleLabor;
}

export async function seedLabor() {
  const laborSeeds = loadLaborSeeds();
  
  if (laborSeeds.length === 0) {
    console.log("No labor entries to seed");
    return { successCount: 0, errorCount: 0, total: 0 };
  }
  
  let successCount = 0;
  let errorCount = 0;

  for (const laborEntry of laborSeeds) {
    try {
      const { estimate_id, description,  price } = laborEntry;
      
      await db.insert(labor).values({
        estimate_id,
        description,
        hours:0,
        rate:0,
        price,
      });
      
      successCount++;
      if (successCount % 100 === 0) {
        console.log(`Processed ${successCount} labor entries...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`Error processing labor entry for estimate ${laborEntry.estimate_id}:`, error);
    }
  }

  console.log(`Labor seeding complete! Success: ${successCount}, Errors: ${errorCount}`);
  
  return {
    successCount,
    errorCount,
    total: laborSeeds.length
  };
}