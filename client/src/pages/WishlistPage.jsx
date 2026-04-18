import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { getProductId, getProductHandle } from "../lib/productUtils";

function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">Wishlist</span>
          <h2>Your Saved Favorites</h2>
          <p>Keep track of the styles you love most.</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="auth-card text-center">
            <h3>No wishlist items yet</h3>
            <p>Save your favorite turbans and come back to them anytime.</p>
            <Link to="/products" className="btn btn-primary auth-btn">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {wishlistItems.map((product) => {
              const productId = getProductId(product);

              return (
                <div className="product-card" key={productId}>
                  <div className="product-image">
                    <div className="product-badge">{product.tag}</div>
                    {product.image ? <img src={product.image} alt={product.name} className="product-image-tag" /> : <div className="turban-shape product-shape"></div>}
                  </div>

                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-price">{product.displayPrice}</p>

                    <div className="product-actions">
                      <Link to={`/products/${getProductHandle(product)}`} className="btn btn-outline small-btn">View</Link>
                      <button type="button" className="btn btn-outline small-btn" onClick={() => removeFromWishlist(productId)}>
                        Remove
                      </button>
                      <button type="button" className="btn btn-primary small-btn" onClick={() => addToCart(product, product.variants?.[0] || null)} disabled={product.stock <= 0}>
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default WishlistPage;
