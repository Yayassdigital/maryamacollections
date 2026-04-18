import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();

  const navClass = ({ isActive }) => (isActive ? "nav-link active-link" : "nav-link");
  const dashboardPath = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <>
      <header className="navbar">
        <div className="container nav-content">
          <Link to="/" className="logo-link" aria-label="MARYAMA TURBANS Home">
            <Logo />
          </Link>

          <nav className="nav-links">
            <NavLink to="/" className={navClass}>Home</NavLink>
            <NavLink to="/products" className={navClass}>Shop</NavLink>
            <NavLink to="/collections" className={navClass}>Collections</NavLink>
            <NavLink to="/about" className={navClass}>About</NavLink>
            <NavLink to="/contact" className={navClass}>Contact</NavLink>
            <NavLink to="/wishlist" className={navClass}>Wishlist ({totalWishlistItems})</NavLink>
            <NavLink to="/cart" className={navClass}>Cart ({totalItems})</NavLink>
            {user?.role === "admin" ? <NavLink to="/admin" className={navClass}>Admin</NavLink> : null}
          </nav>

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="nav-text-link">
                  {user?.name || "Dashboard"}
                </Link>
                <button type="button" className="btn btn-outline" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-text-link">Sign In</Link>
                <Link to="/signup" className="btn btn-primary nav-cta">
                  Create Account
                </Link>
              </>
            )}

            <button
              type="button"
              className="menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default Navbar;
