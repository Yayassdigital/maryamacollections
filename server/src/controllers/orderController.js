import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

const STATE_DELIVERY_FEES = {
  Kano: 1500,
  Kaduna: 2500,
  Abuja: 3000,
  Lagos: 3500,
  default: 2800,
};

const estimateDelivery = (shippingMethod, state) => {
  if (shippingMethod === "Pickup") return "Ready for pickup within 24 hours";
  const normalizedState = String(state || "").trim();
  if (["Kano"].includes(normalizedState)) return "1 - 2 business days";
  if (["Kaduna", "Abuja"].includes(normalizedState)) return "2 - 3 business days";
  return "3 - 5 business days";
};

const calculateDeliveryFee = (shippingMethod, state) => {
  if (shippingMethod === "Pickup") return 0;
  const normalizedState = String(state || "").trim();
  return STATE_DELIVERY_FEES[normalizedState] || STATE_DELIVERY_FEES.default;
};

const toPositiveInt = (value, fallback = 1) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
};

const resolveCouponDiscount = async (couponCode, subtotal) => {
  if (!couponCode) {
    return { coupon: null, discountAmount: 0 };
  }

  const normalizedCode = String(couponCode).trim().toUpperCase();
  const coupon = await Coupon.findOne({ code: normalizedCode, isActive: true });

  if (!coupon) {
    throw new Error("Coupon code is invalid or inactive");
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    throw new Error("Coupon code has expired");
  }

  if (subtotal < Number(coupon.minOrderValue || 0)) {
    throw new Error(`Coupon requires a minimum order of ₦${Number(coupon.minOrderValue || 0).toLocaleString()}`);
  }

  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = (subtotal * Number(coupon.amount || 0)) / 100;
    if (coupon.maxDiscount > 0) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }
  } else {
    discountAmount = Number(coupon.amount || 0);
  }

  discountAmount = Math.max(0, Math.min(discountAmount, subtotal));
  return { coupon, discountAmount };
};

export const createOrder = async (req, res) => {
  try {
    const {
      items = [],
      shippingAddress = {},
      deliveryFee,
      paymentMethod,
      paymentReference,
      shippingMethod,
      couponCode,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state
    ) {
      return res.status(400).json({ message: "Shipping details are incomplete" });
    }

    if (String(shippingAddress.fullName || "").trim().length < 2) {
      return res.status(400).json({ message: "Enter a valid customer name" });
    }

    if (String(shippingAddress.note || "").length > 300) {
      return res.status(400).json({ message: "Order note must be 300 characters or fewer" });
    }

    const productIds = items.map((item) => item.productId).filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (!productIds.length) {
      return res.status(400).json({ message: "Invalid products in cart" });
    }

    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((product) => [String(product._id), product]));
    const orderItems = [];

    for (const item of items) {
      const product = productMap.get(String(item.productId));
      if (!product) {
        return res.status(400).json({ message: `Product is no longer available: ${item.name || "Unknown item"}` });
      }

      const qty = toPositiveInt(item.quantity, 1);
      const unitPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      const selectedVariant = item.selectedVariant || {};

      orderItems.push({
        name: product.name,
        qty,
        image: (product.images && product.images[0]) || product.image || item.image || "",
        price: unitPrice,
        selectedVariant: {
          color: selectedVariant.color || "",
          size: selectedVariant.size || "",
          material: selectedVariant.material || "",
          sku: selectedVariant.sku || "",
        },
        product: product._id,
      });
    }

    const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const normalizedShippingMethod = shippingMethod || "Home Delivery";
    const shippingPrice = Number.isFinite(Number(deliveryFee))
      ? Number(deliveryFee)
      : calculateDeliveryFee(normalizedShippingMethod, shippingAddress.state);
    const taxPrice = 0;

    let discountAmount = 0;
    let normalizedCouponCode = "";
    if (couponCode) {
      try {
        const { coupon, discountAmount: resolvedDiscount } = await resolveCouponDiscount(couponCode, itemsPrice);
        normalizedCouponCode = coupon.code;
        discountAmount = resolvedDiscount;
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }

    const totalPrice = Math.max(itemsPrice + shippingPrice + taxPrice - discountAmount, 0);
    const normalizedPaymentMethod = paymentMethod || "Cash on Delivery";
    const isPaid = normalizedPaymentMethod === "Paystack" && Boolean(paymentReference);
    const status = normalizedPaymentMethod === "Cash on Delivery" ? "pending" : isPaid ? "paid" : "pending";

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        country: shippingAddress.country || "Nigeria",
        note: shippingAddress.note || "",
      },
      paymentMethod: normalizedPaymentMethod,
      paymentReference: paymentReference || "",
      shippingMethod: normalizedShippingMethod,
      deliveryLocation: `${shippingAddress.city}, ${shippingAddress.state}`,
      estimatedDelivery: estimateDelivery(normalizedShippingMethod, shippingAddress.state),
      couponCode: normalizedCouponCode,
      discountAmount,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status,
      isPaid,
      paidAt: isPaid ? new Date() : undefined,
      isDelivered: false,
      paymentResult: isPaid
        ? {
            id: paymentReference || "",
            status: "success",
            update_time: new Date().toISOString(),
            email_address: req.user.email,
          }
        : {},
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("orderItems.product", "name slug image images")
      .populate("user", "name email phone");

    res.status(201).json({ message: "Order placed successfully", order: populatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "name slug image images")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your orders", error: error.message });
  }
};

export const getMyOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
      .populate("orderItems.product", "name slug image images")
      .populate("user", "name email phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order details", error: error.message });
  }
};

export const validateCouponCode = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const numericSubtotal = Number(subtotal || 0);
    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const { coupon, discountAmount } = await resolveCouponDiscount(code, numericSubtotal);

    res.status(200).json({
      message: "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        amount: coupon.amount,
      },
      discountAmount,
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to validate coupon" });
  }
};
