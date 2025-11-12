import { db } from "../sqlite-service";
import { estimates } from "../../db/schema";
import { parse } from "csv-parse/sync";
import * as fs from "fs";

interface EstimateSeed {
  id: number;
  car_id: number;
  date: string;
  estimate_type: string;
  hours_taken: number;
  miles: number;
  private_notes: string;
  public_notes: string;
}

function loadEstimateSeeds(): EstimateSeed[] {
  const sampleEstimates: EstimateSeed[] = parse(
    fs.readFileSync("./server/utils/RepairOrder.txt", "utf-8"),
    { columns: true, skip_empty_lines: true }
  );

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
        id,
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
      console.error(
        `Error processing estimate for car ${estimate.car_id}:`,
        error
      );
    }
  }

  console.log(
    `Estimate seeding complete! Success: ${successCount}, Errors: ${errorCount}`
  );

  return {
    successCount,
    errorCount,
    total: estimateSeeds.length,
  };
}
