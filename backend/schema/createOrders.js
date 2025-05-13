export async function createOrders(sql) {
  await sql`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                total_price NUMERIC(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending' CHECK (
                    status IN ('pending', 'paid', 'shipped', 'cancelled')
                ),
                shipping_address TEXT NOT NULL,
                payment_method VARCHAR(50),
                is_paid BOOLEAN DEFAULT FALSE,
                paid_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

  await sql`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255),
                price NUMERIC(10, 2) NOT NULL,
                quantity INTEGER NOT NULL CHECK (quantity > 0),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
}
