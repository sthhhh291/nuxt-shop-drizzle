import { db } from "../sqlite-service";
import { cars } from "../../db/schema";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";

interface CarSeed {
  id: number;
  customer_id: number;
  year: number;
  model: string;
  make: string;
  engine?: string;
  vin?: string;
  license?: string;
  fleet?: string;
  notes?: string;
}

function loadCarSeeds(): CarSeed[] {
  const sampleCars: CarSeed[] = parse(
    fs.readFileSync("./server/utils/Car.txt", "utf-8"),
    {
      columns: true,
      skip_empty_lines: true,
    }
  ) as CarSeed[];

  console.log(`Generated ${sampleCars.length} sample cars.`);
  return sampleCars;
}

export async function seedCars() {
  const carSeeds = loadCarSeeds();

  if (carSeeds.length === 0) {
    console.log("No cars to seed");
    return { successCount: 0, errorCount: 0, total: 0 };
  }

  let successCount = 0;
  let errorCount = 0;

  for (const car of carSeeds) {
    try {
      const {
        id,
        customer_id,
        year,
        model,
        make,
        engine,
        vin,
        license,
        fleet,
        notes,
      } = car;

      await db.insert(cars).values({
        id,
        customer_id,
        year,
        model,
        make,
        engine: engine || null,
        vin: vin || null,
        license: license || null,
        fleet: fleet || null,
        notes: notes || null,
      });

      successCount++;
      if (successCount % 100 === 0) {
        console.log(`Processed ${successCount} cars...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`Error processing car ${car.make} ${car.model}:`, error);
    }
  }

  console.log(
    `Car seeding complete! Success: ${successCount}, Errors: ${errorCount}`
  );

  return {
    successCount,
    errorCount,
    total: carSeeds.length,
  };
}
