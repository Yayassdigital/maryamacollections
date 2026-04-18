function Testimonials() {
  const testimonials = [
    {
      name: "Amina Yusuf",
      quote:
        "The quality is amazing and the design feels so elegant. I truly love the finish.",
    },
    {
      name: "Fatima Bello",
      quote:
        "MARYAMA TURBANS gave me a classy modern look. The comfort is also excellent.",
    },
    {
      name: "Zainab Musa",
      quote:
        "Beautiful wraps, lovely presentation, and the style fits both casual and special events.",
    },
  ];

  return (
    <section className="section alt-bg">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">Testimonials</span>
          <h2>What Our Customers Are Saying</h2>
          <p>Real feedback from women who love style, comfort, and elegance.</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <div className="testimonial-card" key={index}>
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">“{item.quote}”</p>
              <h4>{item.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;