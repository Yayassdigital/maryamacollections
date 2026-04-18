import Order from "../models/Order.js";
import User from "../models/User.js";

export const adminGetUsers = async (req, res) => {
  try {
    const [users, orderStats] = await Promise.all([
      User.find().sort({ createdAt: -1 }).select("name email role createdAt"),
      Order.aggregate([
        {
          $group: {
            _id: "$user",
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: "$totalPrice" },
          },
        },
      ]),
    ]);

    const statsMap = new Map(orderStats.map((entry) => [String(entry._id), entry]));

    const payload = users.map((user) => {
      const stats = statsMap.get(String(user._id));
      return {
        ...user.toObject(),
        totalOrders: stats?.totalOrders || 0,
        totalSpent: stats?.totalSpent || 0,
      };
    });

    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};
