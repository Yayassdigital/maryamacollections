import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatNaira, getProductImages } from "../lib/productUtils";
import { getStatusLabel, getStatusTone } from "../lib/orderUtils";

function OrderDetailsPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await apiRequest(`/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

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
          <span className="section-tag">Order Details</span>
          <h2>Order #{order._id.slice(-6).toUpperCase()}</h2>
          <p>Review your items, delivery information, and payment progress.</p>
        </div>

        <div className="order-detail-layout">
          <div className="order-detail-main">
            <div className="detail-card">
              <div className="detail-card-header">
                <h3>Items Ordered</h3>
                <span className={`status-badge ${getStatusTone(order.status)}`}>{getStatusLabel(order.status)}</span>
              </div>
              <div className="order-line-list">
                {order.orderItems.map((item) => {
                  const images = getProductImages(item.product || item);
                  return (
                    <div key={`${item.product?._id || item.name}-${item.selectedVariant?.sku || item.name}`} className="order-line-item">
                      <img src={images[0] || item.image} alt={item.name} />
                      <div>
                        <h4>{item.name}</h4>
                        <p>{item.selectedVariant?.color || item.selectedVariant?.size || item.selectedVariant?.material ? [item.selectedVariant?.color, item.selectedVariant?.size, item.selectedVariant?.material].filter(Boolean).join(" / ") : "Standard option"}</p>
                        <p>Quantity: {item.qty}</p>
                      </div>
                      <strong>{formatNaira(item.price * item.qty)}</strong>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="detail-card">
              <h3>Delivery Details</h3>
              <div className="detail-grid two-col">
                <div>
                  <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
                  <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
                  <p><strong>Address:</strong> {order.shippingAddress.address}</p>
                </div>
                <div>
                  <p><strong>Location:</strong> {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p><strong>Method:</strong> {order.shippingMethod}</p>
                  <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery || "To be updated"}</p>
                </div>
              </div>
              {order.shippingAddress.note ? <p className="muted-line"><strong>Note:</strong> {order.shippingAddress.note}</p> : null}
            </div>
          </div>

          <aside className="order-detail-side">
            <div className="detail-card sticky-card">
              <h3>Payment Summary</h3>
              <div className="summary-row"><span>Items</span><strong>{formatNaira(order.itemsPrice)}</strong></div>
              <div className="summary-row"><span>Shipping</span><strong>{formatNaira(order.shippingPrice)}</strong></div>
              {order.discountAmount > 0 ? <div className="summary-row"><span>Discount</span><strong>- {formatNaira(order.discountAmount)}</strong></div> : null}
              <div className="summary-row total-row"><span>Total</span><strong>{formatNaira(order.totalPrice)}</strong></div>
              <div className="summary-row"><span>Payment Method</span><strong>{order.paymentMethod}</strong></div>
              <div className="summary-row"><span>Payment Status</span><strong>{order.isPaid ? "Paid" : "Awaiting Payment"}</strong></div>
              {order.couponCode ? <div className="summary-row"><span>Coupon</span><strong>{order.couponCode}</strong></div> : null}
              {order.paymentReference ? <div className="summary-row"><span>Reference</span><strong>{order.paymentReference}</strong></div> : null}
              <Link to="/products" className="btn btn-outline full-width">Shop More</Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default OrderDetailsPage;
