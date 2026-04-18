import { Link } from "react-router-dom";

function BrandStory() {
  return (
    <section className="section alt-bg">
      <div className="container brand-story-grid">
        <div className="brand-story-card accent-panel">
          <span className="section-tag">Brand Story</span>
          <h2>Designed for modest beauty, premium comfort, and everyday confidence.</h2>
          <p>
            MARYAMA TURBANS blends luxury presentation with practical comfort. Every collection is styled to feel elegant,
            secure, and easy to wear whether the occasion is daily errands, formal events, bridal moments, or premium gifting.
          </p>
          <div className="brand-pill-row">
            <span className="mini-pill">Luxury Finish</span>
            <span className="mini-pill">Soft Fabrics</span>
            <span className="mini-pill">Fast Nationwide Delivery</span>
          </div>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">Shop the Store</Link>
            <Link to="/contact" className="btn btn-outline">Talk to Support</Link>
          </div>
        </div>

        <div className="brand-story-stack">
          <div className="story-metric-card">
            <strong>4 Collections</strong>
            <p>Classic, luxury, bridal, and casual pieces with polished detail.</p>
          </div>
          <div className="story-metric-card">
            <strong>Premium Packaging</strong>
            <p>Store-ready brand presentation that feels premium from homepage to checkout.</p>
          </div>
          <div className="story-metric-card">
            <strong>Customer-first Design</strong>
            <p>Wishlist, saved addresses, real orders, reviews, coupons, and admin insight in one system.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandStory;
