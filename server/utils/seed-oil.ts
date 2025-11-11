import { db } from "../sqlite-service";
import { oil } from "../../db/schema";

interface OilSeed {
  estimate_id: number;
  type: string;
  quantity: number;
  price_per_unit: number;
  cost: number;
}

function loadOilSeeds(): OilSeed[] {
  const sampleOil: OilSeed[] = [
    {
      estimate_id: 1,
      type: "Full Synthetic 5W-30",
      quantity: 5.0,
      price_per_unit: 12.00,
      cost: 8.50
    },
    {
      estimate_id: 3,
      type: "ATF+4 Transmission Fluid",
      quantity: 4.0,
      price_per_unit: 18.00,
      cost: 12.00
    },
    {
      estimate_id: 4,
      type: "Conventional 5W-20",
      quantity: 4.5,
      price_per_unit: 8.00,
      cost: 5.50
    }
  ];

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
      const { estimate_id, type, quantity, price_per_unit, cost } = oilEntry;
      
      await db.insert(oil).values({
        estimate_id,
        type,
        quantity,
        price_per_unit,
        cost,
      });
      
      successCount++;
      if (successCount % 100 === 0) {
        console.log(`Processed ${successCount} oil entries...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`Error processing oil entry ${oilEntry.type}:`, error);
    }
  }

  console.log(`Oil seeding complete! Success: ${successCount}, Errors: ${errorCount}`);
  
  return {
    successCount,
    errorCount,
    total: oilSeeds.length
  };
}