import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatNaira, getProductImages } from "../lib/productUtils";
import { getStatusLabel, getStatusTone, ORDER_STATUSES } from "../lib/orderUtils";

function AdminOrderDetailsPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    status: "pending",
    isPaid: false,
    adminNote: "",
    paymentReference: "",
    estimatedDelivery: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await apiRequest(`/admin/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(data);
        setFormData({
          status: data.status || "pending",
          isPaid: Boolean(data.isPaid),
          adminNote: data.adminNote || "",
          paymentReference: data.paymentReference || "",
          estimatedDelivery: data.estimatedDelivery || "",
        });
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const data = await apiRequest(`/admin/orders/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      setOrder(data.order);
      setSuccessMessage(data.message || "Order updated successfully");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (loading) {
    return <section className="section"><div className="container"><p className="text-center">Loading order details...</p></div></section>;
  }

  if (errorMessage || !order) {
    return <section className="section"><div className="container"><div className="form-message error">{errorMessage || "Order not found"}</div></div></section>;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading align-left">
          <span className="section-tag">Admin Order Desk</span>
          <h2>Order #{order._id.slice(-6).toUpperCase()}</h2>
          <p>Update payment, shipping progress, and customer delivery notes from one screen.</p>
        </div>

        <div className="order-detail-layout">
          <div className="order-detail-main">
            <div className="detail-card">
              <div className="detail-card-header">
                <h3>Customer & Shipping</h3>
                <span className={`status-badge ${getStatusTone(order.status)}`}>{getStatusLabel(order.status)}</span>
              </div>
              <div className="detail-grid two-col">
                <div>
                  <p><strong>Customer:</strong> {order.user?.name || order.shippingAddress.fullName}</p>
                  <p><strong>Email:</strong> {order.user?.email || "Not available"}</p>
                  <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
                </div>
                <div>
                  <p><strong>Address:</strong> {order.shippingAddress.address}</p>
                  <p><strong>City / State:</strong> {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p><strong>Shipping Method:</strong> {order.shippingMethod}</p>
                </div>
              </div>
              {order.shippingAddress.note ? <p className="muted-line"><strong>Customer Note:</strong> {order.shippingAddress.note}</p> : null}
            </div>

            <div className="detail-card">
              <h3>Ordered Products</h3>
              <div className="order-line-list compact">
                {order.orderItems.map((item) => {
                  const images = getProductImages(item.product || item);
                  return (
                    <div key={`${item.product?._id || item.name}-${item.selectedVariant?.sku || item.name}`} className="order-line-item">
                      <img src={images[0] || item.image} alt={item.name} />
                      <div>
                        <h4>{item.name}</h4>
                        <p>{[item.selectedVariant?.color, item.selectedVariant?.size, item.selectedVariant?.material].filter(Boolean).join(" / ") || "Standard option"}</p>
                        <p>Qty: {item.qty}</p>
                      </div>
                      <strong>{formatNaira(item.price * item.qty)}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="order-detail-side">
            <form className="auth-form sticky-card" onSubmit={handleSubmit}>
              <h3>Update Order</h3>
              {errorMessage ? <div className="form-message error">{errorMessage}</div> : null}
              {successMessage ? <div className="form-message success">{successMessage}</div> : null}

              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>{getStatusLabel(status)}</option>
                  ))}
                </select>
              </div>

              <label className="checkbox-row">
                <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleChange} />
                <span>Mark payment as confirmed</span>
              </label>

              <div className="form-group">
                <label>Payment Reference</label>
                <input name="paymentReference" value={formData.paymentReference} onChange={handleChange} placeholder="e.g. PSK-2026-0001" />
              </div>

              <div className="form-group">
                <label>Estimated Delivery</label>
                <input name="estimatedDelivery" value={formData.estimatedDelivery} onChange={handleChange} placeholder="e.g. 2 - 3 business days" />
              </div>

              <div className="form-group">
                <label>Admin Note</label>
                <textarea name="adminNote" rows="4" value={formData.adminNote} onChange={handleChange} placeholder="Internal update or message for order handling" />
              </div>

              <button type="submit" className="btn btn-primary auth-btn">Save Update</button>

              <div className="summary-stack">
                <div className="summary-row"><span>Total</span><strong>{formatNaira(order.totalPrice)}</strong></div>
                <div className="summary-row"><span>Paid</span><strong>{order.isPaid ? "Yes" : "No"}</strong></div>
                <div className="summary-row"><span>Created</span><strong>{new Date(order.createdAt).toLocaleString()}</strong></div>
              </div>
            </form>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default AdminOrderDetailsPage;
