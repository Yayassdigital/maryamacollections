import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../lib/productUtils";
import { getStatusLabel, getStatusTone } from "../lib/orderUtils";

function AdminPage() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const adminAlerts = summary ? [
    summary.counts.lowStockProducts > 0 ? `${summary.counts.lowStockProducts} product(s) need stock attention` : null,
    summary.counts.pendingOrders > 0 ? `${summary.counts.pendingOrders} order(s) still pending action` : null,
    summary.counts.activeCoupons > 0 ? `${summary.counts.activeCoupons} active coupon(s) running in the store` : null,
  ].filter(Boolean) : [];

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await apiRequest("/admin/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSummary(data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchSummary();
  }, [token]);

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading align-left">
          <span className="section-tag">Admin Control Center</span>
          <h2>Store Management Dashboard</h2>
          <p>Track revenue, orders, stock pressure, and the customers keeping the store active.</p>
        </div>

        {errorMessage ? <div className="form-message error">{errorMessage}</div> : null}

        {summary ? (
          <div className="alert-strip">
            {adminAlerts.map((alert) => <span key={alert} className="mini-pill mini-pill-alert">{alert}</span>)}
          </div>
        ) : (
          <div className="stats-grid skeleton-grid">
            {Array.from({ length: 4 }).map((_, index) => <div key={index} className="stat-card skeleton-card"></div>)}
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card"><span>Total Products</span><strong>{summary?.counts.totalProducts ?? "--"}</strong></div>
          <div className="stat-card"><span>Total Users</span><strong>{summary?.counts.totalUsers ?? "--"}</strong></div>
          <div className="stat-card"><span>Total Orders</span><strong>{summary?.counts.totalOrders ?? "--"}</strong></div>
          <div className="stat-card"><span>Total Revenue</span><strong>{summary ? formatNaira(summary.revenue.total) : "--"}</strong></div>
          <div className="stat-card"><span>Pending Orders</span><strong>{summary?.counts.pendingOrders ?? "--"}</strong></div>
          <div className="stat-card alert"><span>Low Stock Products</span><strong>{summary?.counts.lowStockProducts ?? "--"}</strong></div>
          <div className="stat-card"><span>Active Coupons</span><strong>{summary?.counts.activeCoupons ?? "--"}</strong></div>
          <div className="stat-card"><span>Total Reviews</span><strong>{summary?.counts.totalReviews ?? "--"}</strong></div>
        </div>

        <div className="dashboard-grid admin-dashboard-grid">
          <div className="dashboard-card wide-card">
            <div className="card-title-row">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-link-grid">
              <Link to="/admin/products" className="btn btn-outline">Manage Products</Link>
              <Link to="/admin/orders" className="btn btn-outline">Manage Orders</Link>
              <Link to="/admin/users" className="btn btn-outline">View Users</Link>
              <Link to="/admin/coupons" className="btn btn-outline">Manage Coupons</Link>
              <Link to="/admin/analytics" className="btn btn-primary">Open Analytics</Link>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Revenue Snapshot</h3>
            <div className="summary-stack">
              <div className="summary-row"><span>Total Revenue</span><strong>{summary ? formatNaira(summary.revenue.total) : "--"}</strong></div>
              <div className="summary-row"><span>Paid Revenue</span><strong>{summary ? formatNaira(summary.revenue.paid) : "--"}</strong></div>
              <div className="summary-row"><span>Outstanding</span><strong>{summary ? formatNaira(summary.revenue.unpaid) : "--"}</strong></div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid admin-dashboard-grid">
          <div className="dashboard-card wide-card">
            <div className="card-title-row">
              <h3>Recent Orders</h3>
              <Link to="/admin/orders" className="text-link">See all</Link>
            </div>
            <div className="compact-list">
              {summary?.recentOrders?.length ? summary.recentOrders.map((order) => (
                <Link to={`/admin/orders/${order._id}`} key={order._id} className="compact-list-item compact-list-link">
                  <div>
                    <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                    <p>{order.user?.name || order.shippingAddress?.fullName || "Unknown customer"}</p>
                  </div>
                  <div className="align-right">
                    <strong>{formatNaira(order.totalPrice)}</strong>
                    <span className={`status-badge ${getStatusTone(order.status)}`}>{getStatusLabel(order.status)}</span>
                  </div>
                </Link>
              )) : <p className="muted-line">No recent orders yet.</p>}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-title-row">
              <h3>Latest Customers</h3>
            </div>
            <div className="compact-list">
              {summary?.recentUsers?.length ? summary.recentUsers.map((user) => (
                <div key={user._id} className="compact-list-item">
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.email}</p>
                  </div>
                  <span className="mini-pill">{user.role}</span>
                </div>
              )) : <p className="muted-line">No customer records yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPage;
