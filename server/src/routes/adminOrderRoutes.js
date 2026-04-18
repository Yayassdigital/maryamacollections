import express from "express";
import {
  adminGetOrderById,
  adminGetOrders,
  adminUpdateOrderStatus,
} from "../controllers/adminOrderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, adminGetOrders);
router.get("/:id", protect, adminOnly, adminGetOrderById);
router.put("/:id", protect, adminOnly, adminUpdateOrderStatus);

export default router;
