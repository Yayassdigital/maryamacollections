import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    try {
      const data = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccessMessage(data.message || "Account created successfully");
      toast.success(data.message || "Account created successfully");

      setTimeout(() => {
        if (data.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 700);
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
            <span className="section-tag">Join Our Store</span>
            <h1>Create your account and start shopping in style</h1>
            <p>
              Build your account to manage purchases, saved products, and a more
              personalized shopping experience.
            </p>

            <div className="auth-feature-list">
              <div className="auth-feature-item">Quick access to your orders</div>
              <div className="auth-feature-item">Better shopping experience</div>
              <div className="auth-feature-item">Exclusive updates and offers</div>
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-heading">
              <span className="section-tag">Create Account</span>
              <h2>Get Started</h2>
              <p>Fill in your details below.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {errorMessage ? <div className="form-message error">{errorMessage}</div> : null}
              {successMessage ? <div className="form-message success">{successMessage}</div> : null}

              <div className="form-group">
                <label htmlFor="signup-name">Full Name</label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-email">Email Address</label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-confirm-password">Confirm Password</label>
                <input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignupPage;