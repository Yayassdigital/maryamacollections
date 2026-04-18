function PageHero({ tag, title, description }) {
  return (
    <section className="section policy-hero-section alt-bg">
      <div className="container">
        <div className="section-heading narrow-heading">
          <span className="section-tag">{tag}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
}

export default PageHero;
