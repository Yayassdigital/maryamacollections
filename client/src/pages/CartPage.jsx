import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatNaira, getSellingPrice } from "../lib/productUtils";

function CartPage() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, subtotal, deliveryFee, total } = useCart();

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">Cart</span>
          <h2>Your Shopping Cart</h2>
          <p>Review the items you want to purchase.</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="empty-state">
                <h3>Your cart is empty</h3>
                <p>Add some beautiful turbans to continue shopping.</p>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemId = item.cartKey;

                return (
                  <div className="cart-item" key={itemId}>
                    <div className="cart-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px" }} />
                      ) : (
                        <div className="turban-shape cart-shape"></div>
                      )}
                    </div>

                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p>{formatNaira(getSellingPrice(item))}</p>
                      <span>Quantity: {item.quantity}</span>
                      {item.selectedVariant ? <p className="product-subtext">{[item.selectedVariant.color, item.selectedVariant.size, item.selectedVariant.material].filter(Boolean).join(" / ")}</p> : null}

                      <div className="quantity-controls">
                        <button type="button" className="btn btn-outline small-btn" onClick={() => decreaseQuantity(itemId)}>
                          -
                        </button>
                        <button type="button" className="btn btn-outline small-btn" onClick={() => increaseQuantity(itemId)}>
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <button type="button" className="btn btn-outline small-btn" onClick={() => removeFromCart(itemId)}>
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatNaira(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <strong>{formatNaira(deliveryFee)}</strong>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>{formatNaira(total)}</strong>
            </div>

            <Link
              to="/checkout"
              className={`btn btn-primary auth-btn ${cartItems.length === 0 ? "disabled-link" : ""}`}
              onClick={(e) => {
                if (cartItems.length === 0) e.preventDefault();
              }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CartPage;
