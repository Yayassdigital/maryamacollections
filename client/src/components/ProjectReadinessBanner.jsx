import { Link } from "react-router-dom";

function ProjectReadinessBanner() {
  return (
    <section className="section alt-bg project-readiness-section">
      <div className="container project-readiness-grid">
        <div>
          <span className="section-tag">Defense Ready</span>
          <h2>This project now includes diagrams, workflows, and deployment notes for presentation.</h2>
          <p>
            Beyond the storefront, the system now carries architecture diagrams, use cases, ER structure, and workflow explanations
            that make your final-year defense stronger and easier to explain.
          </p>
        </div>
        <div className="project-readiness-card">
          <div className="project-bullets">
            <span className="mini-pill">System Architecture</span>
            <span className="mini-pill">ER Diagram</span>
            <span className="mini-pill">Use Case Flow</span>
            <span className="mini-pill">Deployment Guide</span>
          </div>
          <Link to="/project-overview" className="btn btn-primary">Open Project Overview</Link>
        </div>
      </div>
    </section>
  );
}

export default ProjectReadinessBanner;
