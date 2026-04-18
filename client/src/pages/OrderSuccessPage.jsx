import { Link, useParams } from "react-router-dom";

function OrderSuccessPage() {
  const { id } = useParams();
  const shortId = id?.slice(-6).toUpperCase();

  return (
    <section className="section">
      <div className="container narrow-container">
        <div className="success-panel luxury-success-panel">
          <span className="section-tag">Order Confirmed</span>
          <h2>Your order has been placed successfully</h2>
          <p>
            Thank you for shopping with MARYAMA TURBANS. Your order reference is <strong>{shortId}</strong>.
          </p>

          <div className="order-confirmation-card email-style-card">
            <div className="card-title-row">
              <div>
                <strong>Confirmation Summary</strong>
                <p className="muted-line">A premium, email-style confirmation screen for a more realistic e-commerce experience.</p>
              </div>
              <span className="mini-pill">#{shortId}</span>
            </div>

            <ul className="confirmation-list">
              <li>Your order has been recorded in your account dashboard.</li>
              <li>Admin can update the status in real time as payment and delivery progress.</li>
              <li>You can view delivery estimate, address details, and item summary on the order page.</li>
            </ul>
          </div>

          <div className="page-actions">
            <Link to={`/my-orders/${id}`} className="btn btn-primary">
              View Order Details
            </Link>
            <Link to="/products" className="btn btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccessPage;
