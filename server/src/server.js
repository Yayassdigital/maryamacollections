import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import { sanitizeRequest } from "./middleware/sanitizeMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import adminSummaryRoutes from "./routes/adminSummaryRoutes.js";
import adminCouponRoutes from "./routes/adminCouponRoutes.js";

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, "../uploads");

fs.mkdirSync(uploadsPath, { recursive: true });

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests from this device. Please wait a little and try again.",
  },
});

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please slow down and try again.",
  },
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(compression());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use(sanitizeRequest);
app.use("/uploads", express.static(uploadsPath));

app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);

app.get("/", (req, res) => {
  res.send("MARYAMA TURBANS API is running...");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/summary", adminSummaryRoutes);
app.use("/api/admin/coupons", adminCouponRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((error, req, res, next) => {
  console.error("GLOBAL SERVER ERROR:", error);

  if (
    error?.message?.includes("Only JPG") ||
    error?.message?.includes("JPEG") ||
    error?.message?.includes("PNG") ||
    error?.message?.includes("WEBP") ||
    error?.message?.includes("GIF")
  ) {
    return res.status(400).json({
      message: error.message,
      error: error.message,
    });
  }

  if (error?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Image must be 5MB or smaller",
      error: "Image must be 5MB or smaller",
    });
  }

  return res.status(error?.status || 500).json({
    message: error?.message || "Server error",
    error: error?.message || "Unknown error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});