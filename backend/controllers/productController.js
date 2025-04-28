import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const [products, [{ count }]] = await Promise.all([
      sql`
        SELECT * FROM products
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      sql`
        SELECT COUNT(*)::int AS count FROM products
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

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
      SELECT * FROM products WHERE id = ${id}
    `;

    res.status(200).json({
      success: true,
      data: product[0],
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
  const { name, image, price } = req.body;

  if (!name || !image || !price) {
    return res.status(400).json({
      success: false,
      message: "Please provide all fields",
    });
  }

  try {
    const newProduct = await sql`
      INSERT INTO products (name, image, price)
      VALUES (${name}, ${image}, ${price})
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
  const { name, image, price } = req.body;

  try {
    const updatedProduct = await sql`
      UPDATE products
      SET name = ${name}, image = ${image}, price = ${price}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedProduct.length === 0) {
      res.status(404).json({
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
      DELETE FROM products WHERE id = ${id}
      RETURNING *
    `;

    if (deletedProduct.length === 0) {
      res.status(404).json({
        success: false,
        message: "Product not found",
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
