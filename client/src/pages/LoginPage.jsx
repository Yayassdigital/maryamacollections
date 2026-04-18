import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data = await login(formData);
      setSuccessMessage(data.message || "Login successful");
      toast.success(data.message || "Login successful");
      setTimeout(() => navigate(data.user?.role === "admin" ? "/admin" : "/dashboard"), 800);
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
    }
  };

  return (
    <section className="auth-page">
      <div className="container">
        <div className="auth-shell">
          <div className="auth-side-panel">
            <span className="section-tag">MARYAMA TURBANS</span>
            <h1>Welcome back to your fashion space</h1>
            <p>
              Sign in to track orders, manage your profile, save favorites, and
              continue shopping smoothly.
            </p>

            <div className="auth-feature-list">
              <div className="auth-feature-item">Track your orders easily</div>
              <div className="auth-feature-item">Save favorite collections</div>
              <div className="auth-feature-item">Faster checkout experience</div>
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-heading">
              <span className="section-tag">Sign In</span>
              <h2>Access Your Account</h2>
              <p>Enter your details to continue.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {errorMessage ? <div className="form-message error">{errorMessage}</div> : null}
              {successMessage ? (
                <div className="form-message success">{successMessage}</div>
              ) : null}

              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-row">
                <label className="remember-wrap">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <Link to="/forgot-password" className="auth-mini-link">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="auth-switch">
              Don’t have an account? <Link to="/signup">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
