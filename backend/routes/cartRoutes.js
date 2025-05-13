import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCart);
router.post("/items", addToCart);
router.put("/items/:id", updateCartItem);
router.delete("/items/:id", deleteCartItem);
router.delete("/", clearCart);

export default router;
