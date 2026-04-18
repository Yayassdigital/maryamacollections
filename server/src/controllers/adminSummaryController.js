import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";

export const getAdminSummary = async (req, res) => {
  try {
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      pendingOrders,
      paidOrders,
      deliveredOrders,
      lowStockProducts,
      activeCoupons,
      featuredProducts,
      newArrivalProducts,
      reviewTotals,
      revenueStats,
      ratingStats,
      recentOrders,
      recentUsers,
      salesByMonth,
      ordersByStatus,
      topSellingProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ isPaid: true }),
      Order.countDocuments({ status: "delivered" }),
      Product.countDocuments({ stock: { $lte: 5 } }),
      Coupon.countDocuments({ isActive: true }),
      Product.countDocuments({ isFeatured: true }),
      Product.countDocuments({ newArrival: true }),
      Product.aggregate([
        { $project: { totalReviews: { $size: { $ifNull: ["$reviews", []] } } } },
        { $group: { _id: null, totalReviews: { $sum: "$totalReviews" } } },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
            paidRevenue: {
              $sum: {
                $cond: [{ $eq: ["$isPaid", true] }, "$totalPrice", 0],
              },
            },
          },
        },
      ]),
      Product.aggregate([
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
          },
        },
      ]),
      Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(5),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt"),
      Order.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalSales: { $sum: "$totalPrice" },
            totalOrders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
      ]),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Order.aggregate([
        { $unwind: "$orderItems" },
        {
          $group: {
            _id: "$orderItems.name",
            unitsSold: { $sum: "$orderItems.qty" },
            revenue: { $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] } },
          },
        },
        { $sort: { unitsSold: -1, revenue: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const revenue = revenueStats[0] || { totalRevenue: 0, paidRevenue: 0 };
    const totalRevenue = revenue.totalRevenue || 0;
    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    res.status(200).json({
      counts: {
        totalProducts,
        totalUsers,
        totalOrders,
        pendingOrders,
        paidOrders,
        deliveredOrders,
        lowStockProducts,
        activeCoupons,
        totalReviews: reviewTotals[0]?.totalReviews || 0,
      },
      revenue: {
        total: totalRevenue,
        paid: revenue.paidRevenue || 0,
        unpaid: totalRevenue - (revenue.paidRevenue || 0),
      },
      insights: {
        averageOrderValue,
        averageRating: ratingStats[0]?.averageRating || 0,
        featuredProducts,
        newArrivalProducts,
      },
      recentOrders,
      recentUsers,
      charts: {
        salesByMonth: salesByMonth.map((item) => ({
          label: `${String(item._id.month).padStart(2, "0")}/${item._id.year}`,
          totalSales: item.totalSales,
          totalOrders: item.totalOrders,
        })),
        ordersByStatus: ordersByStatus.map((item) => ({
          status: item._id,
          count: item.count,
        })),
        topSellingProducts,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin summary", error: error.message });
  }
};
