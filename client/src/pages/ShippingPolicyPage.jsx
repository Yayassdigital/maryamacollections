import PageHero from "../components/PageHero";

function ShippingPolicyPage() {
  return (
    <>
      <PageHero
        tag="Shipping Policy"
        title="Delivery and shipping information"
        description="This page explains delivery logic clearly and supports the checkout and admin workflow already built into the system."
      />
      <section className="section">
        <div className="container policy-layout">
          <article className="policy-panel">
            <h3>Shipping Methods</h3>
            <ul className="policy-list">
              <li>Home Delivery for standard customer orders</li>
              <li>Pickup option for local collection and reduced delivery cost</li>
              <li>State-based shipping fees calculated during checkout</li>
            </ul>
          </article>
          <article className="policy-panel">
            <h3>Estimated Delivery</h3>
            <ul className="policy-list">
              <li>Kano: 1 - 2 business days</li>
              <li>Kaduna / Abuja: 2 - 3 business days</li>
              <li>Other supported states: 3 - 5 business days</li>
            </ul>
          </article>
          <article className="policy-panel">
            <h3>Important Notes</h3>
            <p>
              Delivery estimates begin after order confirmation. Public holidays, weather conditions, or incomplete address information
              may affect dispatch time.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

export default ShippingPolicyPage;
