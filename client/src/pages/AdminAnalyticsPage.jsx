import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../lib/productUtils";
import { getStatusLabel } from "../lib/orderUtils";
import AreaTrendChart from "../components/analytics/AreaTrendChart";
import DonutStatusChart from "../components/analytics/DonutStatusChart";
import InsightSummary from "../components/analytics/InsightSummary";

function MetricBars({ title, items, valueKey, labelKey, formatter = (value) => value }) {
  const maxValue = useMemo(() => Math.max(...items.map((item) => item[valueKey] || 0), 1), [items, valueKey]);

  return (
    <div className="dashboard-card wide-card">
      <div className="card-title-row">
        <h3>{title}</h3>
      </div>
      <div className="metric-bars">
        {items.length ? items.map((item) => (
          <div className="metric-bar-row" key={`${title}-${item[labelKey]}`}>
            <div className="metric-bar-labels">
              <span>{item[labelKey]}</span>
              <strong>{formatter(item[valueKey])}</strong>
            </div>
            <div className="metric-bar-track">
              <div className="metric-bar-fill" style={{ width: `${Math.max((item[valueKey] / maxValue) * 100, 10)}%` }} />
            </div>
          </div>
        )) : <p className="muted-line">No data yet.</p>}
      </div>
    </div>
  );
}

function AdminAnalyticsPage() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [token]);

  const insightCards = summary ? [
    {
      label: "Average Order Value",
      value: formatNaira(summary.insights.averageOrderValue),
      note: "Useful for checking how much each customer spends per completed order.",
    },
    {
      label: "Average Product Rating",
      value: `${summary.insights.averageRating.toFixed(1)} / 5`,
      note: "Shows how well the current catalogue is satisfying customers.",
    },
    {
      label: "Featured Products",
      value: `${summary.insights.featuredProducts}`,
      note: "Helps you see how much premium merchandising is active in the store.",
      tone: "warm",
    },
    {
      label: "New Arrivals",
      value: `${summary.insights.newArrivalProducts}`,
      note: "Tracks how often the storefront is being refreshed for returning buyers.",
    },
  ] : [];

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading align-left">
          <span className="section-tag">Analytics</span>
          <h2>Store Insights</h2>
          <p>See what is selling, what is delayed, and where your money is really coming from.</p>
        </div>

        {errorMessage ? <div className="form-message error">{errorMessage}</div> : null}
        {loading ? <p className="text-center">Loading analytics...</p> : null}

        {summary ? (
          <>
            <div className="stats-grid">
              <div className="stat-card"><span>Total Products</span><strong>{summary.counts.totalProducts}</strong></div>
              <div className="stat-card"><span>Total Users</span><strong>{summary.counts.totalUsers}</strong></div>
              <div className="stat-card"><span>Paid Orders</span><strong>{summary.counts.paidOrders}</strong></div>
              <div className="stat-card"><span>Delivered Orders</span><strong>{summary.counts.deliveredOrders}</strong></div>
              <div className="stat-card"><span>Pending Orders</span><strong>{summary.counts.pendingOrders}</strong></div>
              <div className="stat-card alert"><span>Low Stock</span><strong>{summary.counts.lowStockProducts}</strong></div>
              <div className="stat-card"><span>Active Coupons</span><strong>{summary.counts.activeCoupons}</strong></div>
              <div className="stat-card"><span>Total Reviews</span><strong>{summary.counts.totalReviews}</strong></div>
            </div>

            <InsightSummary items={insightCards} />

            <div className="dashboard-grid analytics-grid premium-chart-grid">
              <div className="dashboard-card wide-card">
                <div className="card-title-row">
                  <h3>Sales by Month</h3>
                  <span className="mini-pill">Trend View</span>
                </div>
                <AreaTrendChart
                  points={(summary.charts?.salesByMonth || []).map((item) => ({ label: item.label, value: item.totalSales }))}
                  formatter={(value) => formatNaira(value)}
                />
              </div>

              <div className="dashboard-card">
                <div className="card-title-row">
                  <h3>Orders by Status</h3>
                </div>
                <DonutStatusChart
                  items={(summary.charts?.ordersByStatus || []).map((item) => ({
                    ...item,
                    label: getStatusLabel(item.status),
                  }))}
                />
              </div>
            </div>

            <div className="dashboard-grid analytics-grid">
              <MetricBars
                title="Top Selling Products"
                items={summary.charts?.topSellingProducts || []}
                valueKey="unitsSold"
                labelKey="_id"
                formatter={(value) => `${value} sold`}
              />

              <div className="dashboard-card">
                <div className="card-title-row">
                  <h3>Recent Orders</h3>
                </div>
                <div className="compact-list">
                  {summary.recentOrders?.length ? summary.recentOrders.map((order) => (
                    <div key={order._id} className="compact-list-item">
                      <div>
                        <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                        <p>{order.user?.name || order.shippingAddress?.fullName || "Unknown customer"}</p>
                      </div>
                      <div className="align-right">
                        <strong>{formatNaira(order.totalPrice)}</strong>
                        <span className="status-badge neutral">{getStatusLabel(order.status)}</span>
                      </div>
                    </div>
                  )) : <p className="muted-line">No recent orders.</p>}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default AdminAnalyticsPage;
