import PageHero from "../components/PageHero";

function ReturnPolicyPage() {
  return (
    <>
      <PageHero
        tag="Return Policy"
        title="Returns and exchange rules"
        description="This page helps the store look serious and customer-focused by explaining what can and cannot be returned."
      />
      <section className="section">
        <div className="container policy-layout">
          <article className="policy-panel">
            <h3>Eligible Returns</h3>
            <ul className="policy-list">
              <li>Wrong product supplied</li>
              <li>Product damaged during delivery</li>
              <li>Major quality defect confirmed by support</li>
            </ul>
          </article>
          <article className="policy-panel">
            <h3>Non-returnable Cases</h3>
            <ul className="policy-list">
              <li>Used products</li>
              <li>Items damaged after delivery</li>
              <li>Products returned without proof of purchase</li>
            </ul>
          </article>
          <article className="policy-panel">
            <h3>Return Window</h3>
            <p>Customers should contact support within 48 hours of delivery to start a review for refund, replacement, or exchange.</p>
          </article>
        </div>
      </section>
    </>
  );
}

export default ReturnPolicyPage;
