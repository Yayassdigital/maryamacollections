import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function MobileMenu({ isOpen, onClose }) {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const dashboardPath = user?.role === "admin" ? "/admin" : "/dashboard";

  const navClass = ({ isActive }) => (isActive ? "mobile-active-link" : "");

  return (
    <div className={`mobile-menu ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button type="button" className="mobile-close" onClick={onClose} aria-label="Close menu">
            ×
          </button>
        </div>

        <nav className="mobile-nav-links">
          <NavLink to="/" className={navClass} onClick={onClose}>Home</NavLink>
          <NavLink to="/products" className={navClass} onClick={onClose}>Shop</NavLink>
          <NavLink to="/collections" className={navClass} onClick={onClose}>Collections</NavLink>
          <NavLink to="/about" className={navClass} onClick={onClose}>About</NavLink>
          <NavLink to="/contact" className={navClass} onClick={onClose}>Contact</NavLink>
          <NavLink to="/project-overview" className={navClass} onClick={onClose}>Project Overview</NavLink>
          <NavLink to="/wishlist" className={navClass} onClick={onClose}>Wishlist ({totalWishlistItems})</NavLink>
          <NavLink to="/cart" className={navClass} onClick={onClose}>Cart ({totalItems})</NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to={dashboardPath} className={navClass} onClick={onClose}>
                {user?.name || "Dashboard"}
              </NavLink>
              {user?.role === "admin" ? <NavLink to="/admin" className={navClass} onClick={onClose}>Admin</NavLink> : null}
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass} onClick={onClose}>Sign In</NavLink>
              <NavLink to="/signup" className={navClass} onClick={onClose}>Create Account</NavLink>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}

export default MobileMenu;
