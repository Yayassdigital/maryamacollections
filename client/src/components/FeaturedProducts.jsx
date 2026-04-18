import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { getProductHandle, getProductId, normalizeProduct } from "../lib/productUtils";
import { useCart } from "../context/CartContext";

function FeaturedProducts() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await apiRequest("/products/featured");
        setProducts(data.map((item) => normalizeProduct(item)).filter(Boolean));
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="section alt-bg" id="products">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">Featured Products</span>
          <h2>Our Most Loved Turbans</h2>
          <p>
            Explore handpicked premium headbands and turbans with elegant
            finishing and lasting comfort.
          </p>
        </div>

        {loading ? <p className="text-center">Loading featured products...</p> : null}
        {errorMessage ? <div className="form-message error">{errorMessage}</div> : null}

        {!loading && !errorMessage ? (
          <div className="product-grid">
            {products.slice(0, 4).map((product) => (
              <div className="product-card" key={getProductId(product)}>
                <div className="product-image">
                  <div className="product-badge">{product.tag}</div>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="product-image-tag" />
                  ) : (
                    <div className="turban-shape product-shape"></div>
                  )}
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">{product.displayPrice}</p>
                  <div className="product-actions">
                    <button
                      type="button"
                      className="btn btn-outline small-btn"
                      onClick={() => addToCart(product, product.variants?.[0] || null)}
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                    <Link to={`/products/${getProductHandle(product)}`} className="btn btn-primary small-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {products.length === 0 ? (
              <div className="auth-card text-center">
                <h3>No featured products yet</h3>
                <p>Add products from the admin panel and mark them as featured.</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default FeaturedProducts;
