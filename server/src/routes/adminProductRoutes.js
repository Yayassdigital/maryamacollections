import express from "express";
import {
  adminGetProducts,
  adminGetSingleProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminToggleReviewVisibility,
} from "../controllers/adminProductController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, adminGetProducts);
router.get("/:id", protect, adminOnly, adminGetSingleProduct);
router.post("/", protect, adminOnly, upload.array("images", 6), adminCreateProduct);
router.put("/:id", protect, adminOnly, upload.array("images", 6), adminUpdateProduct);
router.patch("/:id/reviews/:reviewId/toggle", protect, adminOnly, adminToggleReviewVisibility);
router.delete("/:id", protect, adminOnly, adminDeleteProduct);

export default router;
