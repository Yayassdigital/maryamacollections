import express from "express";
import {
  signupUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist", protect, addWishlistItem);
router.delete("/wishlist/:productId", protect, removeWishlistItem);

export default router;
