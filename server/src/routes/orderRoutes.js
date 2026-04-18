import express from "express";
import { createOrder, getMyOrderById, getMyOrders, validateCouponCode } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.post("/validate-coupon", protect, validateCouponCode);
router.get("/mine", protect, getMyOrders);
router.get("/:id", protect, getMyOrderById);

export default router;
