function InsightSummary({ items = [] }) {
  return (
    <div className="insight-grid">
      {items.map((item) => (
        <div key={item.label} className={`insight-card ${item.tone || ""}`.trim()}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <p>{item.note}</p>
        </div>
      ))}
    </div>
  );
}

export default InsightSummary;
