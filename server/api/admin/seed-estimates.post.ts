import { db } from "~~/server/sqlite-service";
import { estimates } from "~~/db/schema";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";

export default defineEventHandler(async (event) => {
  try {
    interface EstimateSeed {
      id?: string;
      car_id?: string;
      date?: string;
      estimate_type?: string;
      hours_taken?: number;
      miles?: number;
      private_notes?: string;
      public_notes?: string;
    }
    const estimateSeeds = parse(
      fs.readFileSync(
        path.resolve(process.cwd(), "app/lib/seeds/RepairOrder.txt"),
        "utf-8"
      ),
      {
        columns: true,
        skip_empty_lines: true,
      }
    ) as EstimateSeed[];

    estimateSeeds.map((estimate) => {
        estimate.hours_taken = 0;
        estimate.miles = 0;
        estimate.estimate_type = "Repair Order";
        estimate.private_notes = estimate.private_notes || "";
        estimate.public_notes = estimate.public_notes || "";
    });

    console.log(`Parsed ${estimateSeeds.length} estimates from CSV.`);



    // Insert the seed data into the database
    // await db.insert(estimates).values(estimateSeeds).execute();
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
          id: id || undefined,
          car_id: car_id || "",
          date: date || "",
          estimate_type: estimate_type || "Repair Order",
          hours_taken: hours_taken || 0,
          miles: miles || 0,
          private_notes: private_notes || "",
          public_notes: public_notes || "",
        });
      } catch (estimateError) {
        console.error(
          "Error inserting estimate:",
          estimateError,
          "Estimate data:",
          estimate
        );
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error seeding estimates:", error);
    return { error: "Failed to seed estimates" };
  }
});
