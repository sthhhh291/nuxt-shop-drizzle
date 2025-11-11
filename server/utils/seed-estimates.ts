import { db } from "../sqlite-service";
import { estimates } from "../../db/schema";

interface EstimateSeed {
  car_id: number;
  date: string;
  estimate_type: string;
  hours_taken: number;
  miles: number;
  private_notes: string;
  public_notes: string;
}

function loadEstimateSeeds(): EstimateSeed[] {
  const sampleEstimates: EstimateSeed[] = [
    {
      car_id: 1,
      date: "2024-01-15",
      estimate_type: "Oil Change",
      hours_taken: 0.5,
      miles: 35000,
      private_notes: "Customer mentioned slight noise from engine",
      public_notes: "Standard oil change with synthetic oil. Engine running smooth."
    },
    {
      car_id: 2, 
      date: "2024-01-18",
      estimate_type: "Brake Inspection",
      hours_taken: 1.0,
      miles: 42000,
      private_notes: "Front pads at 30%, rears at 50%",
      public_notes: "Brake system inspected. Pads in good condition, service recommended in 10k miles."
    },
    {
      car_id: 3,
      date: "2024-01-20",
      estimate_type: "Transmission Service",
      hours_taken: 2.5,
      miles: 78000,
      private_notes: "Fleet vehicle, regular maintenance schedule",
      public_notes: "Transmission fluid and filter replaced. System functioning properly."
    },
    {
      car_id: 4,
      date: "2024-01-22",
      estimate_type: "General Inspection",
      hours_taken: 1.5,
      miles: 125000,
      private_notes: "High mileage vehicle, check all systems",
      public_notes: "Comprehensive inspection completed. Minor wear items noted, overall condition good."
    },
    {
      car_id: 1,
      date: "2024-01-25",
      estimate_type: "Tire Rotation",
      hours_taken: 0.75,
      miles: 35200,
      private_notes: "Customer drives mostly highway miles",
      public_notes: "Tires rotated and balanced. Even wear pattern observed."
    }
  ];

  console.log(`Generated ${sampleEstimates.length} sample estimates.`);
  return sampleEstimates;
}

export async function seedEstimates() {
  const estimateSeeds = loadEstimateSeeds();
  
  if (estimateSeeds.length === 0) {
    console.log("No estimates to seed");
    return { successCount: 0, errorCount: 0, total: 0 };
  }
  
  let successCount = 0;
  let errorCount = 0;

  for (const estimate of estimateSeeds) {
    try {
      const {
        car_id,
        date,
        estimate_type,
        hours_taken,
        miles,
        private_notes,
        public_notes,
      } = estimate;
      
      await db.insert(estimates).values({
        car_id,
        date,
        estimate_type,
        hours_taken,
        miles,
        private_notes,
        public_notes,
      });
      
      successCount++;
      if (successCount % 100 === 0) {
        console.log(`Processed ${successCount} estimates...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`Error processing estimate for car ${estimate.car_id}:`, error);
    }
  }

  console.log(`Estimate seeding complete! Success: ${successCount}, Errors: ${errorCount}`);
  
  return {
    successCount,
    errorCount,
    total: estimateSeeds.length
  };
}