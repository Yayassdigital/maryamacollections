import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../lib/productUtils";
import { getStatusLabel, getStatusTone } from "../lib/orderUtils";

function MyOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiRequest("/orders/mine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">My Orders</span>
          <h2>Your Order History</h2>
          <p>Track every purchase, payment progress, and delivery timeline.</p>
        </div>

        {errorMessage ? <div className="form-message error">{errorMessage}</div> : null}
        {loading ? <p className="text-center">Loading your orders...</p> : null}

        {!loading ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Paid</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-6).toUpperCase()}</td>
                    <td>{order.orderItems?.reduce((sum, item) => sum + item.qty, 0) || 0}</td>
                    <td>{formatNaira(order.totalPrice)}</td>
                    <td><span className={`status-badge ${getStatusTone(order.status)}`}>{getStatusLabel(order.status)}</span></td>
                    <td>{order.isPaid ? "Yes" : "No"}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/my-orders/${order._id}`} className="btn btn-outline small-btn">View</Link>
                    </td>
                  </tr>
                ))}

                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7">No orders yet.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default MyOrdersPage;
