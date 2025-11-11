import { seedContacts } from "./seed-contacts";
import { seedCars } from "./seed-cars";
import { seedEstimates } from "./seed-estimates";
import { seedLabor } from "./seed-labor";
import { seedParts } from "./seed-parts";
import { seedOil } from "./seed-oil";

export async function seedAll() {
  console.log("Starting complete database seeding...");
  
  const results = {
    contacts: { successCount: 0, errorCount: 0, total: 0 },
    cars: { successCount: 0, errorCount: 0, total: 0 },
    estimates: { successCount: 0, errorCount: 0, total: 0 },
    labor: { successCount: 0, errorCount: 0, total: 0 },
    parts: { successCount: 0, errorCount: 0, total: 0 },
    oil: { successCount: 0, errorCount: 0, total: 0 },
  };

  try {
    // Seed in dependency order
    console.log("1. Seeding contacts...");
    results.contacts = (await seedContacts()) || results.contacts;
    
    console.log("2. Seeding cars...");
    results.cars = (await seedCars()) || results.cars;
    
    console.log("3. Seeding estimates...");
    results.estimates = (await seedEstimates()) || results.estimates;
    
    console.log("4. Seeding labor...");
    results.labor = (await seedLabor()) || results.labor;
    
    console.log("5. Seeding parts...");
    results.parts = (await seedParts()) || results.parts;
    
    console.log("6. Seeding oil...");
    results.oil = (await seedOil()) || results.oil;
    
    const totals = {
      totalSuccessCount: Object.values(results).reduce((sum, r) => sum + r.successCount, 0),
      totalErrorCount: Object.values(results).reduce((sum, r) => sum + r.errorCount, 0),
      totalRecords: Object.values(results).reduce((sum, r) => sum + r.total, 0),
    };
    
    console.log(`\n🎉 Complete seeding finished!`);
    console.log(`Total Success: ${totals.totalSuccessCount}`);
    console.log(`Total Errors: ${totals.totalErrorCount}`);
    console.log(`Total Records: ${totals.totalRecords}`);
    
    return {
      success: true,
      results,
      totals
    };
    
  } catch (error) {
    console.error("Master seeding failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      results
    };
  }
}