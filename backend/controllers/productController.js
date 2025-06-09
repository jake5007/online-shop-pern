import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  const offset = parseInt(req.query.offset) || 0;
  const { category_id, minPrice, maxPrice, keyword } = req.query;

  let where = sql`WHERE 1=1`;

  if (category_id) {
    where = sql`${where} AND category_id = ${category_id}`;
  }
  if (minPrice) {
    where = sql`${where} AND price >= ${minPrice}`;
  }
  if (maxPrice) {
    where = sql`${where} AND price <= ${maxPrice}`;
  }
  if (keyword) {
    where = sql`${where} AND name ILIKE '%' || ${keyword} || '%'`;
  }

  where = sql`${where} AND is_deleted = false`;

  try {
    const [products, [{ count }]] = await Promise.all([
      sql`
        SELECT * FROM products
        ${where}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      sql`
        SELECT COUNT(*)::int AS count FROM products ${where}
      `,
    ]);

    res.status(200).json({
      success: true,
      data: products,
      totalCount: count,
    });
  } catch (error) {
    console.log("Error getting products: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// review도 같이 들고오도록
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [product] = await sql`
      SELECT p.*, c.id AS category_id, c.name AS category_name FROM products p
      LEFT JOIN categories c 
      ON p.category_id = c.id     
      WHERE p.id = ${id}
      AND p.is_deleted = false
    `;

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // get reviews
    const reviews = await sql`
      SELECT r.id, r.rating, r.comment, r.created_at, u.name AS user_name
      FROM reviews r
      INNER JOIN users u ON r.user_id = u.id 
      WHERE r.product_id = ${id}
      ORDER BY r.created_at DESC
    `;

    res.status(200).json({
      success: true,
      data: {
        ...product,
        reviews,
      },
    });
  } catch (error) {
    console.log("Error getting product: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createProduct = async (req, res) => {
  const { name, image, price, category_id, description, count_in_stock } =
    req.body;

  if (!name || !image || !price || !category_id || !count_in_stock) {
    return res.status(400).json({
      success: false,
      message: "Please provide all essential fields",
    });
  }

  try {
    const newProduct = await sql`
      INSERT INTO products (name, image, price, category_id, description, count_in_stock)
      VALUES (${name}, ${image}, ${price}, ${category_id}, ${description}, ${count_in_stock})
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct[0],
    });
  } catch (error) {
    console.log("Error creating product: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, image, price, category_id, description, count_in_stock } =
    req.body;

  if (!name || !image || !price || !category_id || !count_in_stock) {
    return res.status(400).json({
      success: false,
      message: "Please provide all essential fields",
    });
  }

  try {
    const updatedProduct = await sql`
      UPDATE products
      SET 
        name = ${name}, 
        image = ${image}, 
        price = ${price}, 
        category_id = ${category_id},
        description = ${description},
        count_in_stock = ${count_in_stock},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct[0],
    });
  } catch (error) {
    console.log("Error updating product: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await sql`
      UPDATE products
      SET is_deleted = true, updated_at = NOW()
      WHERE id = ${id} AND is_deleted = false
      RETURNING *
    `;

    if (deletedProduct.length === 0) {
      res.status(404).json({
        success: false,
        message: "Product not found or already deleted",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedProduct[0],
    });
  } catch (error) {
    console.log("Error deleting product: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createProductReview = async (req, res) => {
  const userId = req.user.id;
  const { id: productId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Invalid rating",
    });
  }

  try {
    const [existing] = await sql`
      SELECT * FROM reviews
      WHERE user_id = ${userId} AND product_id = ${productId}
    `;
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product",
      });
    }

    // insert review
    const [review] = await sql`
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES (${userId}, ${productId}, ${rating}, ${comment})
      RETURNING *
    `;

    // update product rating
    const [stats] = await sql`
      SELECT 
        COUNT(*) AS count,
        AVG(rating)::REAL AS average
      FROM reviews
      WHERE product_id = ${productId}
    `;

    await sql`
      UPDATE products
      SET rating = ${stats.average}, num_reviews = ${stats.count}
      WHERE id = ${productId}
    `;

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProductReview = async (req, res) => {
  const userId = req.user.id;
  const { id: productId } = req.params;

  try {
    const [review] = sql`
      SELECT * FROM reviews
      WHERE user_id = ${userId} AND product_id = ${productId}
    `;

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await sql`
      DELETE FROM reviews
      WHERE user_id = ${userId} AND product_id = ${productId}
    `;

    // Recalculate product stats
    const [stats] = sql`
      SELECT
        COUNT(*) AS count,
        AVG(rating)::REAL AS average
      FROM reviews
      WHERE product_id = ${productId}
    `;

    await sql`
      UPDATE products
      SET
        rating = COALESCE(${stats.average}, 0),
        num_reviews = ${stats.count}
      WHERE id = ${productId}
    `;

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
