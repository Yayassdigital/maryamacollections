import express from "express";
import { getProducts, getFeaturedProducts, getSingleProduct, addProductReview } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:slug", getSingleProduct);
router.post("/:slug/reviews", protect, addProductReview);

export default router;
