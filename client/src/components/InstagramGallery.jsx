function InstagramGallery() {
  const galleryItems = [
    { title: "Signature Silk Wrap", caption: "Elegant color layering for premium occasions." },
    { title: "Bridal Headwrap", caption: "Soft structure and polished finishing for event wear." },
    { title: "Everyday Classic", caption: "Comfortable styling for daily confidence." },
    { title: "Luxury Gift Set", caption: "Presentation-ready styling for premium gifting." },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">Style Gallery</span>
          <h2>Visual merchandising that makes the brand feel premium.</h2>
          <p>Use this gallery in your defense to show that the store carries a polished fashion identity, not just products.</p>
        </div>

        <div className="instagram-grid">
          {galleryItems.map((item) => (
            <article key={item.title} className="instagram-card">
              <div className="instagram-media"><span>{item.title}</span></div>
              <div className="instagram-copy">
                <h3>{item.title}</h3>
                <p>{item.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InstagramGallery;
