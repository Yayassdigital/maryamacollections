const categories = [
  {
    title: "Classic Turbans",
    text: "Timeless styles perfect for everyday wear and elegant outings.",
  },
  {
    title: "Luxury Headbands",
    text: "Premium quality pieces designed to elevate your wardrobe.",
  },
  {
    title: "Bridal Turbans",
    text: "Sophisticated designs made for weddings and special ceremonies.",
  },
  {
    title: "Casual Wraps",
    text: "Comfortable and stylish wraps for simple but beautiful looks.",
  },
];

function CategorySection() {
  return (
    <section className="section" id="categories">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">Shop by Category</span>
          <h2>Find the Perfect Style for Every Occasion</h2>
          <p>
            From casual daily wraps to bridal statement pieces, we have
            collections tailored for every woman.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((item, index) => (
            <div className="category-card" key={index}>
              <div className="category-icon">{index + 1}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <a href="#products">Explore</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;