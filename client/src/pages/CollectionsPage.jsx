function CollectionsPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">Collections</span>
          <h2>Curated Turban Collections</h2>
          <p>
            Explore classic, luxury, bridal, and casual collections designed
            for different tastes and occasions.
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Classic Collection</h3>
            <p>Timeless styles for everyday elegance.</p>
          </div>
          <div className="dashboard-card">
            <h3>Luxury Collection</h3>
            <p>Premium statement pieces with refined finishing.</p>
          </div>
          <div className="dashboard-card">
            <h3>Bridal Collection</h3>
            <p>Elegant wedding and occasion turbans.</p>
          </div>
          <div className="dashboard-card">
            <h3>Casual Collection</h3>
            <p>Comfortable and stylish wraps for daily use.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CollectionsPage;