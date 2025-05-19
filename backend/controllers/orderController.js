import { sql } from "../config/db.js";

export const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress, paymentMethod } = req.body;

  // validation
  if (
    !shippingAddress ||
    typeof shippingAddress !== "object" ||
    !shippingAddress.recipient ||
    !shippingAddress.zipcode ||
    !shippingAddress.address1
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid shipping address",
    });
  }

  if (
    !paymentMethod ||
    !["card", "paypal", "kakaopay"].includes(paymentMethod)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment method",
    });
  }

  try {
    const [cart] = await sql`
        SELECT * FROM carts WHERE user_id = ${userId}
    `;

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartItems = await sql`
        SELECT ci.*, p.name, p.image, p.price, p.count_in_stock
        FROM cart_items ci
        INNER JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = ${cart.id}
    `;

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // total price
    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // insert order
    const [order] = await sql`
        INSERT INTO orders (user_id, total_price, shipping_address, payment_method)
        VALUES (
            ${userId},
            ${totalPrice},
            ${JSON.stringify(shippingAddress)},
            ${paymentMethod}
        )
        RETURNING *
    `;

    const orderItemsInsert = cartItems.map((item) => {
      return sql`
            INSERT INTO order_items (order_id, product_id, name, image, price, quantity)
            VALUES (
                ${order.id},
                ${item.product_id},
                ${item.name},
                ${item.image},
                ${item.price},
                ${item.quantity}
            )
        `;
    });

    await Promise.all(orderItemsInsert);

    // clear cart
    await sql`
        DELETE FROM cart_items WHERE cart_id=${cart.id}
    `;

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order.id,
    });
  } catch (err) {
    console.error("Error creating order: ", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await sql`
      SELECT * FROM orders
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error("Error fetching orders: ", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getOrderById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [order] = await sql`
      SELECT * FROM orders WHERE id = ${id}
    `;

    if (!order || order.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const orderItems = await sql`
      SELECT * FROM order_items
      WHERE order_id = ${id}
    `;

    res.status(200).json({
      success: true,
      data: {
        ...order,
        shipping_address: JSON.parse(order.shipping_address),
        order_items: orderItems,
      },
    });
  } catch (err) {
    console.error("Error fetching order: ", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
