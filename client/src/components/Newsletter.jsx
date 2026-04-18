function Newsletter() {
  return (
    <section className="section alt-bg" id="newsletter">
      <div className="container">
        <div className="newsletter-box">
          <div>
            <span className="section-tag">Newsletter</span>
            <h2>Stay Updated on New Arrivals and Offers</h2>
            <p>
              Subscribe to get notified whenever we release fresh styles and
              special discounts.
            </p>
          </div>

          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;