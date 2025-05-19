import { sql } from "../config/db.js";

const SAMPLE_PRODUCTS = [
  {
    name: "Minimalist Backpack",
    category_id: 3, // Clothing
    description: "Sleek design with ample storage for daily essentials.",
    image:
      "https://images.unsplash.com/photo-1591534577302-1696205bb2bc?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 59.99,
    rating: 4.5,
    num_reviews: 112,
  },
  {
    name: "Wireless Noise-Cancelling Headphones",
    category_id: 1, // Electronics
    description:
      "Experience pure sound and deep bass with active noise cancellation.",
    image:
      "https://images.unsplash.com/photo-1491927570842-0261e477d937?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 199.99,
    rating: 4.8,
    num_reviews: 521,
  },
  {
    name: "Ergonomic Office Chair",
    category_id: 4, // Home & Kitchen
    description: "Comfortable and adjustable chair for long working hours.",
    image:
      "https://images.unsplash.com/photo-1688578735352-9a6f2ac3b70a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 129.99,
    rating: 4.2,
    num_reviews: 210,
  },
  {
    name: "Stainless Steel Water Bottle",
    category_id: 6, // Sports & Outdoors
    description: "Keeps your drinks hot or cold for hours.",
    image:
      "https://images.unsplash.com/photo-1664714628878-9d2aa898b9e3?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 24.99,
    rating: 4.7,
    num_reviews: 310,
  },
  {
    name: "Yoga Mat - Non Slip",
    category_id: 6, // Sports & Outdoors
    description: "Ideal for all yoga and workout routines.",
    image:
      "https://images.unsplash.com/photo-1646239646963-b0b9be56d6b5?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 34.99,
    rating: 4.4,
    num_reviews: 178,
  },
  {
    name: "Hardcover Notebook Set",
    category_id: 2, // Books
    description: "Set of 3 durable notebooks, perfect for journaling or notes.",
    image:
      "https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 12.99,
    rating: 4.6,
    num_reviews: 89,
  },
  {
    name: "LED Desk Lamp with USB Charging Port",
    category_id: 1, // Electronics
    description: "Adjustable brightness with built-in USB charger.",
    image:
      "https://images.unsplash.com/photo-1571406487954-dc11b0c0767d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 39.99,
    rating: 4.3,
    num_reviews: 67,
  },
  {
    name: "Pet Grooming Brush",
    category_id: 10, // Pet Supplies
    description: "Gentle on pets, removes loose fur and dirt.",
    image:
      "https://images.unsplash.com/photo-1727510190155-51abda425a82?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 14.99,
    rating: null,
    num_reviews: 0,
  },
  {
    name: "Men’s Moisturizer SPF 30",
    category_id: 7, // Beauty & Personal Care
    description: "Hydrates and protects your skin from the sun.",
    image:
      "https://images.unsplash.com/photo-1629732047847-50219e9c5aef?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 19.99,
    rating: 4.1,
    num_reviews: 42,
  },
  {
    name: "Portable Bluetooth Speaker",
    category_id: 1, // Electronics
    description: "Compact speaker with deep bass and long battery life.",
    image:
      "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 49.99,
    rating: 4.6,
    num_reviews: 245,
  },
];

async function seedDatabase() {
  try {
    // first, clear existing data
    await sql`TRUNCATE TABLE products RESTART IDENTITY`;

    // insert all products
    for (const product of SAMPLE_PRODUCTS) {
      await sql`
        INSERT INTO products (name, category_id, description, image, price, rating, num_reviews)
        VALUES (${product.name}, ${product.category_id}, ${product.description}, ${product.image}, ${product.price}, ${product.rating}, ${product.num_reviews})
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
