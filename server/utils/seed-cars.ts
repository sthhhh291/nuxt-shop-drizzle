import { db } from "../sqlite-service";
import { cars } from "../../db/schema";

interface CarSeed {
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
  const sampleCars: CarSeed[] = [
    {
      make: "Toyota",
      model: "Camry",
      year: 2020,
      engine: "2.5L 4-Cylinder",
      vin: "4T1BF1FK5CU123456",
      license: "ABC123",
      fleet: "",
      notes: "Regular maintenance customer",
      customer_id: 1
    },
    {
      make: "Honda",
      model: "Civic",
      year: 2019,
      engine: "1.5L Turbo",
      vin: "19XFC1F30KE654321",
      license: "XYZ789",
      fleet: "",
      notes: "First time customer",
      customer_id: 2
    },
    {
      make: "Ford",
      model: "F-150",
      year: 2021,
      engine: "3.5L V6 EcoBoost",
      vin: "1FTFW1E85MFC98765",
      license: "TRK001",
      fleet: "Company Fleet",
      notes: "Commercial vehicle - monthly service",
      customer_id: 3
    },
    {
      make: "Chevrolet",
      model: "Malibu",
      year: 2018,
      engine: "1.5L Turbo",
      vin: "1G1ZD5ST5JF111222",
      license: "DEF456",
      fleet: "",
      notes: "High mileage vehicle",
      customer_id: 1
    }
  ];

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
      const { customer_id, year, model, make, engine, vin, license, fleet, notes } = car;
      
      await db.insert(cars).values({
        customer_id,
        year,
        model,
        make,
        engine: engine || null,
        vin: vin || null,
        license: license || null,
        fleet: fleet || null,
        notes: notes || null
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

  console.log(`Car seeding complete! Success: ${successCount}, Errors: ${errorCount}`);
  
  return {
    successCount,
    errorCount,
    total: carSeeds.length
  };
}