import express from "express";
import { adminGetUsers } from "../controllers/adminUserController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, adminGetUsers);

export default router;
