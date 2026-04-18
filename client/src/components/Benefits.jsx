const benefits = [
  {
    title: "Premium Quality",
    text: "Our turbans are crafted with quality fabrics for elegance and comfort.",
  },
  {
    title: "Fast Delivery",
    text: "Quick and reliable delivery to help you receive your order on time.",
  },
  {
    title: "Secure Payments",
    text: "Shop safely with trusted payment methods and protected checkout.",
  },
  {
    title: "Customer Support",
    text: "Friendly support ready to assist with orders, questions, and guidance.",
  },
];

function Benefits() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">Why Choose Us</span>
          <h2>Everything You Need in a Modern Fashion Store</h2>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <div className="benefit-number">0{index + 1}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Benefits;