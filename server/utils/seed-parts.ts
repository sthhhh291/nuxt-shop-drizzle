import { db } from "../sqlite-service";
import { parts } from "../../db/schema";

interface PartSeed {
  estimate_id: number;
  description: string;
  quantity: number;
  cost: number;
  unit_price: number;
  mfr_number: string;
  part_number: string;
  list: number;
}

function loadPartSeeds(): PartSeed[] {
  const sampleParts: PartSeed[] = [
    {
      estimate_id: 1,
      description: "Engine Oil - Full Synthetic 5W-30",
      quantity: 5,
      cost: 8.50,
      unit_price: 12.00,
      mfr_number: "MOBIL1-5W30",
      part_number: "M1-5W30-1QT",
      list: 60.00
    },
    {
      estimate_id: 1,
      description: "Oil Filter",
      quantity: 1,
      cost: 6.00,
      unit_price: 15.00,
      mfr_number: "FRAM-PH7317",
      part_number: "PH7317",
      list: 15.00
    },
    {
      estimate_id: 3,
      description: "Transmission Fluid - ATF+4",
      quantity: 4,
      cost: 12.00,
      unit_price: 18.00,
      mfr_number: "MOPAR-ATF4",
      part_number: "ATF4-1QT",
      list: 72.00
    },
    {
      estimate_id: 3,
      description: "Transmission Filter Kit",
      quantity: 1,
      cost: 25.00,
      unit_price: 45.00,
      mfr_number: "FRAM-FT1218A",
      part_number: "FT1218A",
      list: 45.00
    },
    {
      estimate_id: 4,
      description: "Air Filter",
      quantity: 1,
      cost: 8.00,
      unit_price: 20.00,
      mfr_number: "FRAM-CA10467",
      part_number: "CA10467",
      list: 20.00
    },
    {
      estimate_id: 4,
      description: "Cabin Air Filter",
      quantity: 1,
      cost: 12.00,
      unit_price: 25.00,
      mfr_number: "FRAM-CF10285",
      part_number: "CF10285",
      list: 25.00
    }
  ];

  console.log(`Generated ${sampleParts.length} sample parts.`);
  return sampleParts;
}

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
      const { estimate_id, description, quantity, cost, unit_price, mfr_number, part_number, list } = partEntry;
      
      await db.insert(parts).values({
        estimate_id,
        description,
        quantity,
        cost,
        unit_price,
        mfr_number,
        part_number,
        list,
      });
      
      successCount++;
      if (successCount % 100 === 0) {
        console.log(`Processed ${successCount} parts...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`Error processing part ${partEntry.part_number}:`, error);
    }
  }

  console.log(`Parts seeding complete! Success: ${successCount}, Errors: ${errorCount}`);
  
  return {
    successCount,
    errorCount,
    total: partSeeds.length
  };
}