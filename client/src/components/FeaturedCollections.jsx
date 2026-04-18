function FeaturedCollections() {
  const collections = [
    {
      title: "Classic Collection",
      text: "Elegant everyday styles with timeless beauty.",
    },
    {
      title: "Luxury Collection",
      text: "Premium statement pieces for refined fashion.",
    },
    {
      title: "Bridal Collection",
      text: "Beautiful occasion-ready pieces for special moments.",
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">Featured Collections</span>
          <h2>Curated Styles for Every Mood and Occasion</h2>
          <p>
            Explore handpicked collections designed for everyday elegance,
            premium looks, and unforgettable moments.
          </p>
        </div>

        <div className="collections-grid">
          {collections.map((collection, index) => (
            <div className="collection-card" key={index}>
              <div className="collection-shape"></div>
              <h3>{collection.title}</h3>
              <p>{collection.text}</p>
              <a href="/collections" className="collection-link">
                Explore Collection
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollections;