import { Link } from "react-router-dom";
import Logo from "./Logo";

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p className="footer-text">
            MARYAMA TURBANS is your trusted destination for elegant turban headbands designed with class, modesty,
            beauty, and confidence.
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Shop</Link></li>
            <li><Link to="/collections">Collections</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/project-overview">Project Overview</Link></li>
          </ul>
        </div>

        <div>
          <h4>Customer Care</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/shipping-policy">Shipping Policy</Link></li>
            <li><Link to="/return-policy">Return Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4>Policies</h4>
          <ul>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li>Email: hello@maryamaturbans.com</li>
            <li>Kano, Nigeria</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom footer-bottom-links">
        <p>© 2026 MARYAMA TURBANS. All rights reserved.</p>
        <div className="footer-mini-links">
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Support</Link>
          <Link to="/project-overview">Project Docs</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
