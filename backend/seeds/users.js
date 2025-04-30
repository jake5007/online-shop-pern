import { sql } from "../config/db.js";
import bcrypt from "bcryptjs";

const SAMPLE_USERS = [
  {
    name: "Admin User",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("123123", 10),
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@gmail.com",
    password: bcrypt.hashSync("123123", 10),
    isAdmin: false,
  },
  {
    name: "Jane Doe",
    email: "jane@gmail.com",
    password: bcrypt.hashSync("123123", 10),
    isAdmin: false,
  },
];

async function seedDatabase() {
  try {
    // first, clear existing data
    await sql`TRUNCATE TABLE users`;

    // insert all categories
    for (const user of SAMPLE_USERS) {
      await sql`
        INSERT INTO users (name, email, password_hash, is_admin)
        VALUES (${user.name}, ${user.email}, ${user.password}, ${user.isAdmin})
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
