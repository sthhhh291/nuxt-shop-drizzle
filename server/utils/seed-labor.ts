import { db } from "../sqlite-service";
import { labor } from "../../db/schema";

interface LaborSeed {
  estimate_id: number;
  description: string;
  hours: number;
  rate: number;
  price: number;
}

function loadLaborSeeds(): LaborSeed[] {
  const sampleLabor: LaborSeed[] = [
    {
      estimate_id: 1,
      description: "Oil change service",
      hours: 0.5,
      rate: 120.00,
      price: 60.00
    },
    {
      estimate_id: 2,
      description: "Brake system inspection",
      hours: 1.0,
      rate: 120.00,
      price: 120.00
    },
    {
      estimate_id: 3,
      description: "Transmission service - drain and fill",
      hours: 1.5,
      rate: 120.00,
      price: 180.00
    },
    {
      estimate_id: 3,
      description: "Transmission filter replacement",
      hours: 1.0,
      rate: 120.00,
      price: 120.00
    },
    {
      estimate_id: 4,
      description: "General vehicle inspection",
      hours: 1.5,
      rate: 120.00,
      price: 180.00
    },
    {
      estimate_id: 5,
      description: "Tire rotation and balancing",
      hours: 0.75,
      rate: 120.00,
      price: 90.00
    }
  ];

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
      const { estimate_id, description, hours, rate, price } = laborEntry;
      
      await db.insert(labor).values({
        estimate_id,
        description,
        hours,
        rate,
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