import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../lib/productUtils";
import { getStatusLabel, getStatusTone, ORDER_STATUSES } from "../lib/orderUtils";

function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const handleStatusChange = async (id, status) => {
    try {
      const data = await apiRequest(`/admin/orders/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      setOrders((prev) => prev.map((item) => (item._id === id ? data.order : item)));
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handlePaidToggle = async (id, isPaid) => {
    try {
      const data = await apiRequest(`/admin/orders/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPaid }),
      });

      setOrders((prev) => prev.map((item) => (item._id === id ? data.order : item)));
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiRequest("/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const filteredOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter);

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading align-left">
          <span className="section-tag">Admin Orders</span>
          <h2>Manage Orders</h2>
          <p>Review customer orders, update delivery progress, and jump into full order details.</p>
        </div>

        {errorMessage ? <div className="form-message error">{errorMessage}</div> : null}
        {loading ? <p className="text-center">Loading orders...</p> : null}

        {!loading ? (
          <>
            <div className="filter-toolbar">
              <label>
                Status Filter
                <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                  <option value="all">All</option>
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>{getStatusLabel(status)}</option>
                  ))}
                </select>
              </label>
              <div className="toolbar-meta">{filteredOrders.length} order(s)</div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Shipping</th>
                    <th>Status</th>
                    <th>Paid</th>
                    <th>Date</th>
                    <th>Details</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        {order.user?.name || order.shippingAddress?.fullName || "Unknown"}
                        <br />
                        <small>{order.user?.email || order.shippingAddress?.phone || ""}</small>
                      </td>
                      <td>{order.orderItems?.reduce((sum, item) => sum + item.qty, 0) || 0}</td>
                      <td>{formatNaira(order.totalPrice)}</td>
                      <td>{order.shippingMethod}</td>
                      <td>
                        <select className="status-select" value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>{getStatusLabel(status)}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button type="button" className={`btn small-btn ${order.isPaid ? "btn-primary" : "btn-outline"}`} onClick={() => handlePaidToggle(order._id, !order.isPaid)}>
                          {order.isPaid ? "Paid" : "Mark Paid"}
                        </button>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusTone(order.status)}`}>{getStatusLabel(order.status)}</span>
                        <br />
                        <small>{new Date(order.createdAt).toLocaleDateString()}</small>
                      </td>
                      <td>
                        <Link to={`/admin/orders/${order._id}`} className="btn btn-outline small-btn">Open</Link>
                      </td>
                    </tr>
                  ))}

                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8">No orders found.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default AdminOrdersPage;
