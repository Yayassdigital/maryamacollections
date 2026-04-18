function SkeletonCard({ lines = 3 }) {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image shimmer"></div>
      <div className="skeleton-body">
        <div className="skeleton-line shimmer wide"></div>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className={`skeleton-line shimmer ${index === lines - 1 ? "short" : ""}`}></div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonCard;
