import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    selectedVariant: {
      color: { type: String, trim: true, default: "" },
      size: { type: String, trim: true, default: "" },
      material: { type: String, trim: true, default: "" },
      sku: { type: String, trim: true, default: "" },
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, default: "Nigeria", trim: true },
    note: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const paymentResultSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true },
    status: { type: String, trim: true },
    update_time: { type: String, trim: true },
    email_address: { type: String, trim: true, lowercase: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: { type: [orderItemSchema], required: true, default: [] },
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
      enum: ["Cash on Delivery", "Bank Transfer", "Paystack"],
      default: "Cash on Delivery",
    },
    paymentReference: { type: String, trim: true, default: "" },
    paymentResult: { type: paymentResultSchema, default: {} },
    shippingMethod: {
      type: String,
      trim: true,
      enum: ["Home Delivery", "Pickup"],
      default: "Home Delivery",
    },
    deliveryLocation: { type: String, trim: true, default: "" },
    estimatedDelivery: { type: String, trim: true, default: "" },
    adminNote: { type: String, trim: true, default: "" },
    couponCode: { type: String, trim: true, default: "" },
    discountAmount: { type: Number, default: 0, min: 0 },
    itemsPrice: { type: Number, required: true, default: 0, min: 0 },
    taxPrice: { type: Number, required: true, default: 0, min: 0 },
    shippingPrice: { type: Number, required: true, default: 0, min: 0 },
    totalPrice: { type: Number, required: true, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
