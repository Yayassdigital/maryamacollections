import Coupon from "../models/Coupon.js";

const normalizeCouponPayload = (body = {}) => ({
  code: String(body.code || "").trim().toUpperCase(),
  description: String(body.description || "").trim(),
  discountType: body.discountType === "fixed" ? "fixed" : "percentage",
  amount: Number(body.amount || 0),
  minOrderValue: Number(body.minOrderValue || 0),
  maxDiscount: Number(body.maxDiscount || 0),
  isActive: body.isActive === true || body.isActive === "true" || body.isActive === "on" || body.isActive === "1",
  expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
});

export const adminGetCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coupons", error: error.message });
  }
};

export const adminCreateCoupon = async (req, res) => {
  try {
    const payload = normalizeCouponPayload(req.body);
    if (!payload.code || payload.amount <= 0) {
      return res.status(400).json({ message: "Code and discount amount are required" });
    }

    const coupon = await Coupon.create(payload);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Failed to create coupon", error: error.message });
  }
};

export const adminUpdateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    Object.assign(coupon, normalizeCouponPayload(req.body));
    await coupon.save();

    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Failed to update coupon", error: error.message });
  }
};

export const adminDeleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await coupon.deleteOne();
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete coupon", error: error.message });
  }
};
