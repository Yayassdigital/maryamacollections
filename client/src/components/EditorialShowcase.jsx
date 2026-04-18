function EditorialShowcase() {
  const looks = [
    {
      title: "Heritage Luxe",
      caption: "Clean drape lines, premium finish, and confident styling for statement occasions.",
      meta: "Occasion • Premium Edit",
    },
    {
      title: "Modern Modesty",
      caption: "Soft structure and refined comfort for women who want elegance without noise.",
      meta: "Daily Wear • Signature Feel",
    },
    {
      title: "Bridal Grace",
      caption: "Ceremony-ready headwraps with polished detail and graceful texture pairing.",
      meta: "Event Wear • Bridal Focus",
    },
  ];

  return (
    <section className="section luxury-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">Editorial Luxury</span>
          <h2>A premium visual language that feels like a real fashion brand.</h2>
          <p>These sections help the store feel branded, elevated, and intentionally designed for a luxury audience.</p>
        </div>

        <div className="editorial-grid">
          {looks.map((look, index) => (
            <article className="editorial-card" key={look.title}>
              <div className={`editorial-visual visual-${index + 1}`}>
                <span>{look.meta}</span>
              </div>
              <div className="editorial-copy">
                <h3>{look.title}</h3>
                <p>{look.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EditorialShowcase;
