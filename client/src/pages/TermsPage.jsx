import PageHero from "../components/PageHero";

function TermsPage() {
  return (
    <>
      <PageHero
        tag="Terms & Conditions"
        title="Store terms and service conditions"
        description="These terms give the platform a more complete business presentation for customers, lecturers, and project reviewers."
      />
      <section className="section">
        <div className="container policy-layout">
          <article className="policy-panel">
            <h3>Use of the Store</h3>
            <p>Customers are expected to provide accurate account and shipping information when placing orders or updating profiles.</p>
          </article>
          <article className="policy-panel">
            <h3>Pricing and Availability</h3>
            <p>Prices, product availability, and promotional offers may change. Discounts and coupons depend on admin configuration.</p>
          </article>
          <article className="policy-panel">
            <h3>Order Processing</h3>
            <p>Orders may be cancelled, paused, or updated when payment is incomplete, delivery details are invalid, or stock is unavailable.</p>
          </article>
        </div>
      </section>
    </>
  );
}

export default TermsPage;
