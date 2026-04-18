import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { getProductHandle, getProductId, normalizeProduct } from "../lib/productUtils";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductsPage() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set("search", searchTerm.trim());
        if (selectedCategory !== "All") params.set("category", selectedCategory);
        if (availability !== "all") params.set("availability", availability);
        if (sortBy) params.set("sort", sortBy);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (featuredOnly) params.set("featured", "true");

        const queryString = params.toString();
        const data = await apiRequest(`/products${queryString ? `?${queryString}` : ""}`);
        setProducts(data.map((item) => normalizeProduct(item)).filter(Boolean));
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchProducts();
  }, [searchTerm, selectedCategory, availability, sortBy, minPrice, maxPrice, featuredOnly]);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category).filter(Boolean))],
    [products]
  );

  const handleWishlistToggle = (product) => {
    const productId = getProductId(product);
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setAvailability("all");
    setSortBy("newest");
    setMinPrice("");
    setMaxPrice("");
    setFeaturedOnly(false);
  };

  return (
    <section className="section products-page">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">All Products</span>
          <h2>Explore Our Turban Collections</h2>
          <p>Professional storefront filtering, premium product cards, and a much stronger shopping experience.</p>
        </div>

        <div className="filter-panel">
          <div className="filter-grid">
            <input type="text" placeholder="Search by product name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="filter-input" />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="filter-select">
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="filter-select">
              <option value="all">All availability</option>
              <option value="in-stock">In stock</option>
              <option value="out-of-stock">Out of stock</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="featured">Featured first</option>
              <option value="name-asc">Name A-Z</option>
            </select>
            <input type="number" min="0" placeholder="Min price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="filter-input" />
            <input type="number" min="0" placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="filter-input" />
          </div>

          <div className="filter-actions-row">
            <label className="remember-wrap compact-check">
              <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} />
              <span>Featured only</span>
            </label>
            <button type="button" className="btn btn-outline small-btn" onClick={resetFilters}>Reset Filters</button>
          </div>
        </div>

        {loading ? <div className="product-grid skeleton-product-grid">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="product-card skeleton-card product-card-skeleton"></div>)}</div> : null}
        {errorMessage ? <div className="form-message error">{errorMessage}</div> : null}
        {!loading && !errorMessage ? <p className="product-subtext text-center">Showing {products.length} product{products.length === 1 ? "" : "s"}</p> : null}

        {!loading && !errorMessage ? (
          <div className="product-grid">
            {products.map((product) => {
              const productId = getProductId(product);
              const featuredVariant = product.variants?.[0] || null;

              return (
                <div className="product-card" key={productId}>
                  <div className="product-image">
                    <div className="product-badge">{product.tag}</div>
                    {product.image ? <img src={product.image} alt={product.name} className="product-image-tag" /> : <div className="turban-shape product-shape"></div>}
                  </div>

                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-price">{product.displayPrice}</p>
                    {product.originalPrice ? <p className="product-subtext">Regular price: {product.originalPrice}</p> : null}
                    {featuredVariant ? <p className="product-subtext">Top variant: {featuredVariant.label}</p> : null}
                    <p className="product-subtext">Gallery: {product.images.length} image{product.images.length === 1 ? "" : "s"} · Variants: {product.variants.length}</p>

                    <div className="product-actions">
                      <Link to={`/products/${getProductHandle(product)}`} className="btn btn-outline small-btn">View Details</Link>
                      <button type="button" className="btn btn-primary small-btn" onClick={() => addToCart(product, featuredVariant)} disabled={product.stock <= 0}>{product.stock > 0 ? "Add to Cart" : "Out of Stock"}</button>
                      <button type="button" className="btn btn-outline small-btn" onClick={() => handleWishlistToggle(product)}>{isInWishlist(productId) ? "Saved" : "Wishlist"}</button>
                    </div>
                  </div>
                </div>
              );
            })}

            {products.length === 0 ? (
              <div className="empty-state-card text-center">
                <strong>No products found</strong>
                <p>Try another search, price range, sort option, or category filter.</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default ProductsPage;
