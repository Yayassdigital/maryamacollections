import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";

const ADMIN_EMAIL = "maryamacollections@gmail.com";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "maryama_secret_key", {
    expiresIn: "7d",
  });
};

const normalizeAddress = (address = {}, index = 0) => ({
  label: String(address.label || (index === 0 ? "Home" : `Address ${index + 1}`)).trim(),
  fullName: String(address.fullName || "").trim(),
  phone: String(address.phone || "").trim(),
  address: String(address.address || "").trim(),
  city: String(address.city || "").trim(),
  state: String(address.state || "").trim(),
  country: String(address.country || "Nigeria").trim(),
  isDefault: Boolean(address.isDefault || index === 0),
});

const sanitizeUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  role: user.role,
  savedAddresses: user.savedAddresses || [],
  wishlistCount: user.wishlist?.length || 0,
  createdAt: user.createdAt,
});

const normalizeSavedAddresses = (addresses = []) => {
  const incoming = Array.isArray(addresses) ? addresses : [];
  const cleaned = incoming
    .map((address, index) => normalizeAddress(address, index))
    .filter((address) => address.address || address.city || address.state || address.phone || address.fullName);

  if (!cleaned.length) return [];

  return cleaned.map((address, index) => ({
    ...address,
    isDefault: index === 0 ? true : Boolean(address.isDefault),
  }));
};

export const signupUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (String(name).trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = normalizedEmail === ADMIN_EMAIL ? "admin" : "user";

    const newUser = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      phone: String(phone || "").trim(),
      password: hashedPassword,
      role,
      savedAddresses: [],
      wishlist: [],
    });

    res.status(201).json({
      message: "Account created successfully",
      user: sanitizeUser(newUser),
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (normalizedEmail === ADMIN_EMAIL && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    res.status(200).json({
      message: "Login successful",
      user: sanitizeUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const nextEmail = String(req.body.email || user.email).trim().toLowerCase();
    if (!nextEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const duplicateUser = await User.findOne({ email: nextEmail, _id: { $ne: user._id } });
    if (duplicateUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const nextName = String(req.body.name || user.name).trim();
    if (nextName.length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }

    if (!EMAIL_REGEX.test(nextEmail)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    user.name = nextName;
    user.email = nextEmail;
    user.phone = String(req.body.phone || "").trim();

    if (nextEmail === ADMIN_EMAIL) {
      user.role = "admin";
    }

    if (req.body.savedAddresses !== undefined) {
      user.savedAddresses = normalizeSavedAddresses(req.body.savedAddresses);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatched = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatched) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password", error: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.wishlist || []);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: error.message });
  }
};

export const addWishlistItem = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Valid product is required" });
    }

    const product = await Product.findById(productId).select("_id");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadySaved = user.wishlist.some((item) => String(item) === String(productId));
    if (!alreadySaved) {
      user.wishlist.push(productId);
      await user.save();
    }

    const populated = await User.findById(req.user._id).populate("wishlist");
    res.status(200).json({
      message: alreadySaved ? "Product already in wishlist" : "Product added to wishlist",
      wishlist: populated?.wishlist || [],
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update wishlist", error: error.message });
  }
};

export const removeWishlistItem = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Valid product is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter((item) => String(item) !== String(productId));
    await user.save();

    const populated = await User.findById(req.user._id).populate("wishlist");
    res.status(200).json({ message: "Product removed from wishlist", wishlist: populated?.wishlist || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove wishlist item", error: error.message });
  }
};
