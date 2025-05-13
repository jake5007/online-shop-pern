export async function createCarts(sql) {
  await sql`
            CREATE TABLE IF NOT EXISTS carts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

  await sql`
            CREATE TABLE IF NOT EXISTS cart_items (
                id SERIAL PRIMARY KEY,
                cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id),
                quantity INTEGER NOT NULL CHECK (quantity > 0),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
}
