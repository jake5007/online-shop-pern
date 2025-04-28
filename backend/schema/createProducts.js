export async function createProducts(sql) {
  await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
                count_in_stock INTEGER DEFAULT 0,
                rating REAL CHECK (rating >= 0.0 AND rating <= 5.0),
                num_reviews INTEGER DEFAULT 0,
                description TEXT,
                image VARCHAR(255) NOT NULL,
                price NUMERIC(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
}
