import { sql } from "../config/db.js";

export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const [cart] = await sql`
            SELECT * FROM carts WHERE user_id = ${userId}
        `;

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: [],
        totalQuantity: 0,
        totalPrice: 0,
      });
    }

    const cartItems = await sql`
            SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.image, p.price
            FROM cart_items ci
            INNER JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = ${cart.id}
        `;

    const totalQuantity = cartItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    res.status(200).json({
      success: true,
      cart: cartItems,
      totalQuantity,
      totalPrice,
    });
  } catch (err) {
    console.log("Error getting cart: ", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    // count in stock check
    const [product] = await sql`
            SELECT * FROM products WHERE id = ${productId}
      `;
    if (!product || product.count_in_stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Product not available in stock",
      });
    }

    let [cart] = await sql` 
            SELECT * FROM carts WHERE user_id = ${userId}
        `;

    if (!cart) {
      [cart] = await sql`
            INSERT INTO carts (user_id) VALUES (${userId})
            RETURNING *
        `;
    }

    const [existing] = await sql`
            SELECT * FROM cart_items 
            WHERE cart_id = ${cart.id} AND product_id = ${productId}
        `;

    if (existing) {
      const newQuantity = existing.quantity + quantity;

      if (newQuantity > product.count_in_stock) {
        return res.status(400).json({
          success: false,
          message: "Not enough stock available",
        });
      }

      await sql`
            UPDATE cart_items
            SET quantity = quantity + ${newQuantity}
            WHERE id = ${existing.id}
        `;
    } else {
      await sql`
            INSERT INTO cart_items (cart_id, product_id, quantity)
            VALUES (${cart.id}, ${productId}, ${quantity})
        `;
    }

    res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
    });
  } catch (err) {
    console.log("Error adding to cart: ", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const [item] = await sql`
            SELECT ci.*, c.user_id FROM cart_items ci
            INNER JOIN carts c ON ci.cart_id = c.id
            WHERE ci.id = ${id}
      `;

    if (!item || item.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const [updatedItem] = await sql`
            UPDATE cart_items
            SET quantity = ${quantity}
            WHERE id = ${id}
            RETURNING *
      `;

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      item: updatedItem,
    });
  } catch (err) {
    console.log("Error updating cart item: ", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteCartItem = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [item] = await sql`
            SELECT ci.*, c.user_id FROM cart_items ci
            INNER JOIN carts c ON ci.cart_id = c.id
            WHERE ci.id = ${id}
      `;

    if (!item || item.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const [deletedItem] = await sql`
            DELETE FROM cart_items
            WHERE id = ${id}
            RETURNING *
      `;

    res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
      item: deletedItem,
    });
  } catch (err) {
    console.log("Error deleting cart item: ", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const [cart] = await sql`
            SELECT * FROM carts WHERE user_id = ${userId}
      `;

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart already empty",
      });
    }

    await sql`
      DELETE FROM cart_items WHERE cart_id = ${cart.id}
    `;

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (err) {
    console.log("Error clearing cart: ", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
