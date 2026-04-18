import { Link } from "react-router-dom";

function ShopCTA() {
  return (
    <section className="section">
      <div className="container">
        <div className="shop-cta">
          <div>
            <span className="section-tag light-tag">Modern Elegance</span>
            <h2>Upgrade Your Look with Premium Turban Styles</h2>
            <p>
              Discover fashion pieces crafted for confidence, comfort, and a
              polished modern appearance.
            </p>
          </div>

          <div className="shop-cta-actions">
            <Link to="/products" className="btn btn-primary">
              Shop Now
            </Link>
            <Link to="/collections" className="btn btn-outline cta-outline">
              View Collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShopCTA;