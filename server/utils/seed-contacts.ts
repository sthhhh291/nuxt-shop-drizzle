interface contactSeed {
  id: number;
  last_name: string;
  first_name: string;
  bus_street: string;
  bus_city: string;
  bus_state: string;
  bus_zip: string;
  home_street: string;
  home_city: string;
  home_state: string;
  home_zip: string;
  bus_phone: string;
  home_phone: string;
  cell_phone: string;
  fax: string;
  other_phone: string;
  email: string;
}

import { db } from "../sqlite-service";
import { addresses, customers, emails, phones } from "../../db/schema";
// Removed CSV parsing imports - now using generated data

// Generate sample contact data programmatically
function loadContactSeeds(): contactSeed[] {
  const sampleContacts: contactSeed[] = [
    {
      id: 1,
      first_name: "John",
      last_name: "Smith",
      bus_street: "123 Business Ave",
      bus_city: "Downtown",
      bus_state: "CA",
      bus_zip: "90210",
      home_street: "456 Home St",
      home_city: "Suburb",
      home_state: "CA",
      home_zip: "90211",
      bus_phone: "(555) 123-4567",
      home_phone: "(555) 234-5678",
      cell_phone: "(555) 345-6789",
      fax: "(555) 456-7890",
      other_phone: "",
      email: "john.smith@email.com"
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Doe",
      bus_street: "789 Corporate Blvd",
      bus_city: "Business District",
      bus_state: "CA",
      bus_zip: "90212",
      home_street: "321 Residential Rd",
      home_city: "Hometown",
      home_state: "CA",
      home_zip: "90213",
      bus_phone: "(555) 567-8901",
      home_phone: "(555) 678-9012",
      cell_phone: "(555) 789-0123",
      fax: "",
      other_phone: "(555) 890-1234",
      email: "jane.doe@email.com"
    },
    {
      id: 3,
      first_name: "Mike",
      last_name: "Johnson",
      bus_street: "",
      bus_city: "",
      bus_state: "",
      bus_zip: "",
      home_street: "555 Oak Lane",
      home_city: "Oakville",
      home_state: "CA",
      home_zip: "90214",
      bus_phone: "",
      home_phone: "(555) 901-2345",
      cell_phone: "(555) 012-3456",
      fax: "",
      other_phone: "",
      email: "mike.johnson@email.com"
    }
  ];

  console.log(`Generated ${sampleContacts.length} sample contacts.`);
  return sampleContacts;
}

export async function seedContacts() {
  const contactSeeds = loadContactSeeds();
  
  if (contactSeeds.length === 0) {
    console.log("No contacts to seed");
    return;
  }
  
  let successCount = 0;
  let errorCount = 0;

  for (const contact of contactSeeds) {
    try {
      const {
        id,
        last_name,
        first_name,
        bus_street,
        bus_city,
        bus_state,
        bus_zip,
        home_street,
        home_city,
        home_state,
        home_zip,
        bus_phone,
        home_phone,
        cell_phone,
        fax,
        other_phone,
        email,
      } = contact;

      // Skip if required fields are missing
      //   if (!first_name && !last_name) {
      //     console.warn(`Skipping contact with ID ${id}: No name provided`);
      //     continue;
      //   }

      const [newCustomer] = await db
        .insert(customers)
        .values({
          first_name: first_name || "",
          last_name: last_name || "",
          notes: `Imported contact with ID ${id}`,
        })
        .returning();

      // Only insert addresses if they have street info
      const addressesToInsert = [];

      if (bus_street) {
        addressesToInsert.push({
          street: bus_street,
          city: bus_city || "",
          state: bus_state || "",
          zip_code: bus_zip || "",
          address_type: "business",
          customer_id: newCustomer!.id,
        });
      }

      if (home_street) {
        addressesToInsert.push({
          street: home_street,
          city: home_city || "",
          state: home_state || "",
          zip_code: home_zip || "",
          address_type: "home",
          customer_id: newCustomer!.id,
        });
      }

      if (addressesToInsert.length > 0) {
        await db.insert(addresses).values(addressesToInsert);
      }

      // Only insert phones if they exist
      const phonesToInsert = [
        { phone: bus_phone, type: "business" },
        { phone: home_phone, type: "home" },
        { phone: cell_phone, type: "cell" },
        { phone: fax, type: "fax" },
        { phone: other_phone, type: "other" },
      ]
        .filter((p) => p.phone && p.phone.trim() !== "")
        .map((p) => ({
          phone_number: p.phone,
          phone_type: p.type,
          customer_id: newCustomer!.id,
        }));

      if (phonesToInsert.length > 0) {
        await db.insert(phones).values(phonesToInsert);
      }

      // Only insert email if it exists
      if (email && email.trim() !== "") {
        await db.insert(emails).values({
          email_address: email,
          email_type: "personal",
          customer_id: newCustomer!.id,
        });
      }

      successCount++;
      if (successCount % 100 === 0) {
        console.log(`Processed ${successCount} contacts...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`Error processing contact ID ${contact.id}:`, error);
    }
  }

  console.log(
    `Seeding complete! Success: ${successCount}, Errors: ${errorCount}`
  );
  
  return {
    successCount,
    errorCount,
    total: contactSeeds.length
  };
}
