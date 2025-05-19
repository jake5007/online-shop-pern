import { sql } from "../config/db.js";

const SAMPLE_CATEGORIES = [
  { name: "Electronics" },
  { name: "Books" },
  { name: "Clothing" },
  { name: "Home & Kitchen" },
  { name: "Toys & Games" },
  { name: "Sports & Outdoors" },
  { name: "Beauty & Personal Care" },
  { name: "Automotive" },
  { name: "Health & Wellness" },
  { name: "Pet Supplies" },
];

async function seedDatabase() {
  try {
    // first, clear existing data
    await sql`TRUNCATE TABLE categories RESTART IDENTITY CASCADE`;

    // insert all categories
    for (const category of SAMPLE_CATEGORIES) {
      await sql`
        INSERT INTO categories (name)
        VALUES (${category.name})
      `;
    }

    console.log("Database seeded successfully");
    process.exit(0); // success code
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1); // failure code
  }
}

seedDatabase();
