import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";
import { formatNaira, getProductId, getSellingPrice } from "../lib/productUtils";
import { getDeliveryFee, getEstimatedDelivery, NIGERIAN_STATES } from "../lib/orderUtils";
import { useToast } from "../context/ToastContext";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const { token, user } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "Kano",
    country: "Nigeria",
    note: "",
    paymentMethod: "Cash on Delivery",
    paymentReference: "",
    shippingMethod: "Home Delivery",
  });
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const defaultAddress = user?.savedAddresses?.find((item) => item.isDefault) || user?.savedAddresses?.[0];
    setFormData((prev) => ({
      ...prev,
      fullName: user?.name || prev.fullName,
      phone: user?.phone || defaultAddress?.phone || prev.phone,
      address: defaultAddress?.address || prev.address,
      city: defaultAddress?.city || prev.city,
      state: defaultAddress?.state || prev.state,
      country: defaultAddress?.country || prev.country,
    }));
  }, [user]);

  const deliveryFee = useMemo(
    () => getDeliveryFee(formData.state, formData.shippingMethod),
    [formData.shippingMethod, formData.state]
  );
  const estimatedDelivery = useMemo(
    () => getEstimatedDelivery(formData.state, formData.shippingMethod),
    [formData.shippingMethod, formData.state]
  );
  const total = Math.max(subtotal + deliveryFee - discountAmount, 0);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleApplyCoupon = async () => {
    setCouponMessage("");
    setErrorMessage("");

    if (!couponCode.trim()) {
      setErrorMessage("Enter a coupon code first");
      return;
    }

    try {
      const data = await apiRequest("/orders/validate-coupon", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      setAppliedCoupon(data.coupon);
      setDiscountAmount(Number(data.discountAmount || 0));
      setCouponMessage(data.message || "Coupon applied successfully");
      toast.success(data.message || "Coupon applied successfully");
    } catch (error) {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setErrorMessage(error.message);
      toast.error(error.message);
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cartItems.length) {
      setErrorMessage("Your cart is empty");
      return;
    }

    if (formData.paymentMethod === "Paystack" && !formData.paymentReference.trim()) {
      setErrorMessage("Enter a payment reference for Paystack demo checkout");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        items: cartItems.map((item) => ({
          productId: getProductId(item) || null,
          name: item.name,
          price: getSellingPrice(item),
          quantity: item.quantity,
          image: item.image || "",
          selectedVariant: item.selectedVariant || null,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          note: formData.note,
        },
        paymentMethod: formData.paymentMethod,
        paymentReference: formData.paymentReference,
        shippingMethod: formData.shippingMethod,
        couponCode: appliedCoupon?.code || couponCode.trim(),
        subtotal,
        deliveryFee,
        total,
      };

      const data = await apiRequest("/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      setSuccessMessage(data.message || "Order placed successfully");
      toast.success(data.message || "Order placed successfully");
      const orderId = data.order?._id;
      clearCart();

      setTimeout(() => {
        navigate(orderId ? `/order-success/${orderId}` : "/my-orders");
      }, 700);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">Checkout</span>
          <h2>Complete Your Order</h2>
          <p>Enter your delivery details, choose a payment method, and review your final total.</p>
        </div>

        <div className="cart-layout checkout-layout">
          <div className="cart-items">
            <form className="auth-form" onSubmit={handleSubmit}>
              {errorMessage ? <div className="form-message error">{errorMessage}</div> : null}
              {successMessage ? <div className="form-message success">{successMessage}</div> : null}
              {couponMessage ? <div className="form-message success">{couponMessage}</div> : null}

              <div className="checkout-section-block">
                <h3>Customer Details</h3>
                <div className="form-grid two-col">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input name="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input name="phone" type="text" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div className="checkout-section-block">
                <h3>Shipping Details</h3>
                <div className="form-group">
                  <label>Address</label>
                  <input name="address" type="text" placeholder="Enter delivery address" value={formData.address} onChange={handleChange} required />
                </div>

                <div className="form-grid two-col">
                  <div className="form-group">
                    <label>City</label>
                    <input name="city" type="text" placeholder="Enter your city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <select name="state" value={formData.state} onChange={handleChange}>
                      {NIGERIAN_STATES.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid two-col">
                  <div className="form-group">
                    <label>Country</label>
                    <input name="country" type="text" value={formData.country} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Shipping Method</label>
                    <select name="shippingMethod" value={formData.shippingMethod} onChange={handleChange}>
                      <option value="Home Delivery">Home Delivery</option>
                      <option value="Pickup">Pickup</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="checkout-section-block">
                <h3>Payment</h3>
                <div className="form-grid two-col">
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Paystack">Paystack (Demo)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Payment Reference</label>
                    <input
                      name="paymentReference"
                      type="text"
                      placeholder={formData.paymentMethod === "Paystack" ? "Paste Paystack reference" : "Optional reference"}
                      value={formData.paymentReference}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="checkout-section-block">
                <h3>Coupon / Discount</h3>
                <div className="form-grid coupon-row">
                  <div className="form-group">
                    <label>Coupon Code</label>
                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" />
                  </div>
                  <div className="form-group action-end">
                    <button type="button" className="btn btn-outline small-btn" onClick={handleApplyCoupon}>Apply Coupon</button>
                  </div>
                </div>
                {appliedCoupon ? <p className="muted-line">Applied: <strong>{appliedCoupon.code}</strong> — {appliedCoupon.description || "Discount unlocked"}</p> : null}
              </div>

              <div className="checkout-section-block">
                <div className="form-group">
                  <label>Additional Note</label>
                  <textarea name="note" rows="4" placeholder="Optional delivery note" value={formData.note} onChange={handleChange} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div>
            <div className="summary-row"><span>Delivery Fee</span><strong>{formatNaira(deliveryFee)}</strong></div>
            {discountAmount > 0 ? <div className="summary-row"><span>Discount</span><strong>- {formatNaira(discountAmount)}</strong></div> : null}
            <div className="summary-row"><span>Shipping Method</span><strong>{formData.shippingMethod}</strong></div>
            <div className="summary-row"><span>Payment Method</span><strong>{formData.paymentMethod}</strong></div>
            <div className="summary-row"><span>Estimated Delivery</span><strong>{estimatedDelivery}</strong></div>
            <div className="summary-row total-row"><span>Total</span><strong>{formatNaira(total)}</strong></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;
