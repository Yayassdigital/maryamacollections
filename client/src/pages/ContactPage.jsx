import PageHero from "../components/PageHero";

function ContactPage() {
  return (
    <>
      <PageHero
        tag="Contact Us"
        title="Reach the MARYAMA TURBANS team"
        description="Use this page to present the store as a real brand with customer support, order help, and business enquiries."
      />
      <section className="section">
        <div className="container dashboard-grid admin-dashboard-grid">
          <div className="dashboard-card wide-card">
            <h3>Customer Support</h3>
            <div className="policy-card-grid">
              <div className="policy-card">
                <strong>Email</strong>
                <p>hello@maryamaturbans.com</p>
              </div>
              <div className="policy-card">
                <strong>Phone</strong>
                <p>+234 800 000 0000</p>
              </div>
              <div className="policy-card">
                <strong>Business Hours</strong>
                <p>Monday to Saturday, 9:00 AM - 6:00 PM</p>
              </div>
              <div className="policy-card">
                <strong>Location</strong>
                <p>Kano, Nigeria</p>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Best Reasons to Contact Us</h3>
            <ul className="policy-list">
              <li>Order tracking and delivery updates</li>
              <li>Size, color, or fabric clarification</li>
              <li>Bulk order and bridal enquiries</li>
              <li>Returns, exchanges, and support</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
