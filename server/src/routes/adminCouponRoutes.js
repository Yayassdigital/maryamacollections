import express from "express";
import { adminCreateCoupon, adminDeleteCoupon, adminGetCoupons, adminUpdateCoupon } from "../controllers/adminCouponController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, adminGetCoupons);
router.post("/", protect, adminOnly, adminCreateCoupon);
router.put("/:id", protect, adminOnly, adminUpdateCoupon);
router.delete("/:id", protect, adminOnly, adminDeleteCoupon);

export default router;
