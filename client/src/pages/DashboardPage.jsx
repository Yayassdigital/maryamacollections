import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

function DashboardPage() {
  const { user, token } = useAuth();
  const { totalWishlistItems } = useWishlist();
  const [orderCount, setOrderCount] = useState(0);
  const [recentOrderId, setRecentOrderId] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiRequest("/orders/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrderCount(data.length || 0);
        setRecentOrderId(data[0]?._id || "");
      } catch {
        setOrderCount(0);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading align-left">
          <span className="section-tag">User Dashboard</span>
          <h2>Welcome back, {user?.name || "Customer"}</h2>
          <p>See your saved styles, profile details, and purchase activity in one place.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><span>Orders</span><strong>{orderCount}</strong></div>
          <div className="stat-card"><span>Wishlist</span><strong>{totalWishlistItems}</strong></div>
          <div className="stat-card"><span>Saved Addresses</span><strong>{user?.savedAddresses?.length || 0}</strong></div>
          <div className="stat-card"><span>Profile Status</span><strong>Active</strong></div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Profile</h3>
            <p>Update your phone number, email, and saved delivery addresses.</p>
            <Link to="/profile" className="btn btn-primary small-btn">Manage Profile</Link>
          </div>

          <div className="dashboard-card">
            <h3>My Orders</h3>
            <p>Track current orders, payment progress, and delivery timeline.</p>
            <Link to="/my-orders" className="btn btn-primary small-btn">View Orders</Link>
          </div>

          <div className="dashboard-card">
            <h3>Wishlist</h3>
            <p>Your saved products now persist in your account database.</p>
            <Link to="/wishlist" className="btn btn-primary small-btn">Open Wishlist</Link>
          </div>

          <div className="dashboard-card">
            <h3>Quick Return</h3>
            <p>{recentOrderId ? `Your latest order is #${recentOrderId.slice(-6).toUpperCase()}.` : "Place your first order to track it here."}</p>
            <Link to={recentOrderId ? `/my-orders/${recentOrderId}` : "/products"} className="btn btn-outline small-btn">{recentOrderId ? "Open Latest Order" : "Start Shopping"}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
