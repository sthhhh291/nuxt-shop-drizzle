import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";

export default defineEventHandler(async (event) => {
  try {
    interface ContactSeed {
      id?: string;
      last_name?: string;
      first_name?: string;
      bus_street?: string;
      bus_city?: string;
      bus_state?: string;
      bus_zip?: string;
      home_street?: string;
      home_city?: string;
      home_state?: string;
      home_zip?: string;
      bus_phone?: string;
      home_phone?: string;
      cell_phone?: string;
      fax?: string;
      other_phone?: string;
      email?: string;
    }
    
    const contactSeeds = parse(
      fs.readFileSync(
        path.resolve(process.cwd(), "app/lib/seeds/Contact.txt"),
        "utf-8"
      ),
      {
        columns: true,
        skip_empty_lines: true,
      }
    ) as ContactSeed[];
    contactSeeds.forEach((contact, index) => {
      console.log(`Contact ${index + 1}:`, contact);
    });
    console.log(`Parsed ${contactSeeds.length} contacts from CSV.`);
  } catch (parseError) {
    console.error("Error parsing CSV:", parseError);
    throw parseError;
  }
})