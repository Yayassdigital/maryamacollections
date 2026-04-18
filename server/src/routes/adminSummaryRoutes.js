import express from "express";
import { getAdminSummary } from "../controllers/adminSummaryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAdminSummary);

export default router;
