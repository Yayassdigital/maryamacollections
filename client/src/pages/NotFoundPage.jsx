import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="auth-page">
      <div className="container">
        <div className="auth-card text-center">
          <span className="section-tag">404</span>
          <h1>Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>

          <Link to="/" className="btn btn-primary auth-btn">
            Go Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;