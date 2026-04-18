const diagrams = [
  {
    title: "System Architecture",
    path: "/diagrams/system-architecture.svg",
    caption: "Shows how the React frontend, Express API, MongoDB database, local uploads, and admin/customer flows connect.",
  },
  {
    title: "Use Case Diagram",
    path: "/diagrams/use-case.svg",
    caption: "Shows the core actions available to customers and administrators inside the system.",
  },
  {
    title: "ER Diagram",
    path: "/diagrams/er-diagram.svg",
    caption: "Shows the database relationships between users, products, orders, and coupons.",
  },
  {
    title: "Admin Workflow",
    path: "/diagrams/admin-workflow.svg",
    caption: "Explains the admin operating flow from login to product, coupon, review, and order control.",
  },
  {
    title: "Customer Workflow",
    path: "/diagrams/customer-workflow.svg",
    caption: "Explains the customer journey from browsing to checkout, payment, and order tracking.",
  },
];

function ProjectOverviewPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading align-left">
          <span className="section-tag">Project Overview</span>
          <h2>Defense-ready system explanation</h2>
          <p>
            Use this page during your presentation to walk your supervisor through the architecture, database design,
            workflows, and the overall logic of the MARYAMA TURBANS platform.
          </p>
        </div>

        <div className="overview-intro-grid">
          <div className="dashboard-card wide-card">
            <h3>What this project demonstrates</h3>
            <div className="overview-pill-row">
              <span className="mini-pill">Full-Stack React + Express + MongoDB</span>
              <span className="mini-pill">Admin & Customer Workflows</span>
              <span className="mini-pill">E-commerce Logic</span>
              <span className="mini-pill">Security & File Uploads</span>
            </div>
            <p className="overview-copy">
              This build demonstrates modern product management, real customer ordering, role-based access control,
              analytics, coupons, reviews, multi-image products, variants, and structured academic documentation.
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Defense talking points</h3>
            <ul className="overview-list">
              <li>Explain the problem the system solves for fashion retail operations.</li>
              <li>Walk through the customer journey from product discovery to order success.</li>
              <li>Show how admins manage inventory, reviews, coupons, and delivery updates.</li>
              <li>Point to the ER diagram to explain your database structure clearly.</li>
            </ul>
          </div>
        </div>

        <div className="diagram-grid">
          {diagrams.map((diagram) => (
            <article key={diagram.title} className="diagram-card">
              <div className="diagram-card-header">
                <h3>{diagram.title}</h3>
                <a href={diagram.path} target="_blank" rel="noreferrer" className="text-link">Open full view</a>
              </div>
              <img src={diagram.path} alt={diagram.title} className="diagram-image" />
              <p>{diagram.caption}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectOverviewPage;
