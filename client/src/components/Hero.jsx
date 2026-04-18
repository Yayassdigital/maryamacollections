import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-text">
          <span className="badge">Premium Turban Headbands</span>
          <h1>Elegant Turbans for Modern Women with Style, Confidence, and Luxury Presence</h1>
          <p>
            Discover beautifully crafted turban headbands designed for fashion, comfort, modesty, and refined everyday elegance.
            MARYAMA TURBANS blends premium presentation with practical wearability.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">Shop Collection</Link>
            <Link to="/collections" className="btn btn-outline">View New Arrivals</Link>
          </div>

          <div className="hero-stats">
            <div>
              <h3>500+</h3>
              <p>Happy Customers</p>
            </div>
            <div>
              <h3>40+</h3>
              <p>Turban Styles</p>
            </div>
            <div>
              <h3>24/7</h3>
              <p>Support</p>
            </div>
          </div>
        </div>

        <div className="hero-visual hero-visual-luxury">
          <div className="hero-card big-card">
            <div className="turban-shape turban-1"></div>
            <h3>Luxury Wraps</h3>
            <p>Soft, premium and elegant for special occasions.</p>
          </div>

          <div className="hero-card small-card top-card hero-detail-card">
            <div className="turban-shape turban-2"></div>
            <span>New Collection</span>
          </div>

          <div className="hero-card small-card bottom-card hero-detail-card">
            <div className="turban-shape turban-3"></div>
            <span>Best Seller</span>
          </div>

          <div className="hero-floating-panel">
            <strong>Curated Luxury Styling</strong>
            <p>Designed for women who want polished fashion with modest beauty.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
