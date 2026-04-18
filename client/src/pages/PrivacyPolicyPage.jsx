import PageHero from "../components/PageHero";

function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        tag="Privacy Policy"
        title="How customer information is handled"
        description="This project stores account, order, and address details to support shopping, order management, and admin reporting."
      />
      <section className="section">
        <div className="container policy-layout">
          <article className="policy-panel">
            <h3>Information Collected</h3>
            <ul className="policy-list">
              <li>Name, email, and password for account access</li>
              <li>Phone number and delivery address for order fulfillment</li>
              <li>Order history, wishlist activity, and coupon usage</li>
            </ul>
          </article>
          <article className="policy-panel">
            <h3>Why We Use It</h3>
            <ul className="policy-list">
              <li>To create accounts and authenticate users securely</li>
              <li>To process orders and maintain customer records</li>
              <li>To provide admin analytics and customer support</li>
            </ul>
          </article>
          <article className="policy-panel">
            <h3>Protection</h3>
            <p>Passwords are hashed. Protected routes use JWT authentication, and admin actions require role-based access control.</p>
          </article>
        </div>
      </section>
    </>
  );
}

export default PrivacyPolicyPage;
