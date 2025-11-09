import { db } from "~~/server/sqlite-service";
import { cars } from "~~/db/schema";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";

export default defineEventHandler(async (event) => {
  try {
    interface CarSeed {
      id?: string;
      customer_id?: string;
      year?: string;
      model?: string;
      make?: string;
      engine?: string;
    }
    const carSeeds = parse(
      fs.readFileSync(
        path.resolve(process.cwd(), "app/lib/seeds/Car.txt"),
        "utf-8"
      ),
      {
        columns: true,
        skip_empty_lines: true,
      }
    ) as CarSeed[];
    carSeeds.forEach((car, index) => {
      console.log(`Car ${index + 1}:`, car);
    });
    for (const car of carSeeds) {
      try {
        const { id, customer_id, year, model, make, engine } = car;
        await db.insert(cars).values({
          id: id || undefined,
          customer_id: customer_id || "",
          year: year || "",
          model: model || "",
          make: make || "",
          engine: engine || "",
        });
      } catch (carError) {
        console.error("Error inserting car:", carError, "Car data:", car);
      }
    }
    console.log(`Parsed ${carSeeds.length} cars from CSV.`);
  } catch (parseError) {
    console.error("Error parsing CSV:", parseError);
    throw parseError;
  }
});