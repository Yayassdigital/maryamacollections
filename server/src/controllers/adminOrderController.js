import Order from "../models/Order.js";

export const adminGetOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

export const adminGetOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name slug image images");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order details", error: error.message });
  }
};

export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { status, isPaid, adminNote, paymentReference, estimatedDelivery } = req.body;

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status) {
      order.status = status;
      if (status === "delivered") {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      } else if (status !== "delivered") {
        order.isDelivered = false;
        order.deliveredAt = undefined;
      }
    }

    if (typeof isPaid === "boolean") {
      order.isPaid = isPaid;
      order.paidAt = isPaid ? order.paidAt || new Date() : undefined;
      if (isPaid && ["pending", "cancelled"].includes(order.status)) {
        order.status = "paid";
      }
    }

    if (typeof adminNote === "string") {
      order.adminNote = adminNote.trim();
    }

    if (typeof paymentReference === "string") {
      order.paymentReference = paymentReference.trim();
    }

    if (typeof estimatedDelivery === "string") {
      order.estimatedDelivery = estimatedDelivery.trim();
    }

    const updatedOrder = await order.save();
    await updatedOrder.populate("orderItems.product", "name slug image images");

    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
};
