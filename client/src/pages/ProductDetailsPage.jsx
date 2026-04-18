import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { normalizeProduct } from "../lib/productUtils";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { token, isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [reviewMessage, setReviewMessage] = useState("");

  const fetchProduct = useCallback(async () => {
    try {
      const data = await apiRequest(`/products/${id}`);
      const normalized = normalizeProduct(data);
      setProduct(normalized);
      setActiveImage(normalized.images[0] || normalized.image || "");
      setSelectedVariantId(normalized.variants[0]?.id || "");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    return product.variants.find((item) => item.id === selectedVariantId) || product.variants[0];
  }, [product, selectedVariantId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMessage("");
    setErrorMessage("");

    try {
      const data = await apiRequest(`/products/${id}/reviews`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(reviewForm),
      });
      setReviewMessage(data.message || "Review saved successfully");
      setReviewForm({ rating: 5, title: "", comment: "" });
      await fetchProduct();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (loading) {
    return <section className="section"><div className="container"><div className="product-details-grid premium-product-layout"><div className="product-gallery-main skeleton-card"></div><div className="dashboard-card skeleton-card"></div></div></div></section>;
  }

  if (errorMessage || !product) {
    return (
      <section className="section">
        <div className="container">
          <div className="auth-card text-center">
            <span className="section-tag">Product</span>
            <h2>Product Not Found</h2>
            <p>{errorMessage || "The product you are looking for does not exist."}</p>
            <Link to="/products" className="btn btn-primary auth-btn">Back to Products</Link>
          </div>
        </div>
      </section>
    );
  }

  const visibleReviews = product.reviews?.filter((review) => !review.isHidden) || [];
  const saved = isInWishlist(product._id);

  return (
    <section className="section">
      <div className="container">
        <div className="product-details-grid premium-product-layout">
          <div>
            <div className="product-gallery-main zoom-frame">
              {activeImage ? <img src={activeImage} alt={product.name} className="zoomable-image" /> : <div className="turban-shape product-details-shape"></div>}
            </div>
            {product.images.length > 1 ? (
              <div className="thumbnail-strip">
                {product.images.map((image) => (
                  <button key={image} type="button" className={`thumbnail-btn ${activeImage === image ? "active" : ""}`} onClick={() => setActiveImage(image)}>
                    <img src={image} alt={product.name} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="product-details-info">
            <span className="section-tag">{product.tag}</span>
            <h1>{product.name}</h1>
            <p className="product-price">{product.displayPrice}</p>
            {product.originalPrice ? <p className="product-subtext">Regular price: {product.originalPrice}</p> : null}
            <p className="product-details-text">{product.description}</p>
            <div className="summary-stack compact-rating-box">
              <div className="summary-row"><span>Category</span><strong>{product.category}</strong></div>
              <div className="summary-row"><span>Rating</span><strong>{product.rating.toFixed(1)} / 5</strong></div>
              <div className="summary-row"><span>Reviews</span><strong>{product.numReviews}</strong></div>
              <div className="summary-row"><span>Gallery</span><strong>{product.images.length} image{product.images.length === 1 ? "" : "s"}</strong></div>
            </div>

            {product.variants.length > 0 ? (
              <div className="variant-selector-card">
                <h3>Select Variant</h3>
                <div className="variant-pill-grid">
                  {product.variants.map((variant) => (
                    <button type="button" key={variant.id} className={`variant-pill ${selectedVariant?.id === variant.id ? "active" : ""}`} onClick={() => setSelectedVariantId(variant.id)}>
                      <span>{variant.label}</span>
                      <small>{variant.stock} in stock</small>
                    </button>
                  ))}
                </div>

                {selectedVariant ? (
                  <div className="variant-meta-box">
                    <p><strong>Color:</strong> {selectedVariant.color || "-"}</p>
                    <p><strong>Size:</strong> {selectedVariant.size || "-"}</p>
                    <p><strong>Material:</strong> {selectedVariant.material || "-"}</p>
                    <p><strong>SKU:</strong> {selectedVariant.sku || "-"}</p>
                    <p><strong>Variant Stock:</strong> {selectedVariant.stock}</p>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="product-actions">
              <button type="button" className="btn btn-outline" onClick={() => addToCart(product, selectedVariant)} disabled={(selectedVariant ? selectedVariant.stock : product.stock) <= 0}>
                {(selectedVariant ? selectedVariant.stock : product.stock) > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => (saved ? removeFromWishlist(product._id) : addToWishlist(product))}>{saved ? "Remove Wishlist" : "Save Wishlist"}</button>
              <Link to="/cart" className="btn btn-primary">Go to Cart</Link>
            </div>
          </div>
        </div>

        <div className="dashboard-grid admin-dashboard-grid top-gap">
          <div className="dashboard-card wide-card">
            <div className="card-title-row">
              <h3>Customer Reviews</h3>
              <span className="mini-pill">{product.rating.toFixed(1)} / 5</span>
            </div>
            {visibleReviews.length ? (
              <div className="review-stack">
                {visibleReviews.map((review) => (
                  <div className="review-card" key={review.id}>
                    <div className="card-title-row">
                      <div>
                        <strong>{review.title || "Customer Review"}</strong>
                        <p className="muted-line">by {review.name}</p>
                      </div>
                      <span className="mini-pill">{review.rating}/5</span>
                    </div>
                    <p>{review.comment}</p>
                    <small className="muted-line">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</small>
                  </div>
                ))}
              </div>
            ) : <p className="muted-line">No customer reviews yet. Be the first to leave one.</p>}
          </div>

          <div className="dashboard-card">
            <h3>Leave a Review</h3>
            {reviewMessage ? <div className="form-message success">{reviewMessage}</div> : null}
            {isAuthenticated ? (
              <form className="auth-form" onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label>Rating</label>
                  <select value={reviewForm.rating} onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}>
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Good</option>
                    <option value={2}>2 - Fair</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Review Title</label>
                  <input value={reviewForm.title} onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Elegant and comfortable" />
                </div>
                <div className="form-group">
                  <label>Your Review</label>
                  <textarea rows="5" value={reviewForm.comment} onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))} required />
                </div>
                <button type="submit" className="btn btn-primary auth-btn">Submit Review</button>
              </form>
            ) : (
              <div className="auth-card text-center slim-card">
                <p>Sign in to leave a review for this product.</p>
                <Link to="/login" className="btn btn-primary small-btn">Sign In</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsPage;
