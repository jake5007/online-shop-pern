import express from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  deleteProductReview,
} from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.post("/:id/reviews", authMiddleware, createProductReview);
router.delete("/:id/reviews", authMiddleware, deleteProductReview);

export default router;
