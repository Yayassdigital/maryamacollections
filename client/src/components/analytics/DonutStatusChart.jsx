const tones = ["var(--navy)", "#8f6a3a", "#5f7c6a", "#4f46e5", "#d97706", "#991b1b"];

function DonutStatusChart({ items = [] }) {
  const total = items.reduce((sum, item) => sum + Number(item.count || 0), 0);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="donut-layout">
      <svg viewBox="0 0 220 220" className="donut-chart" role="img" aria-label="Orders by status chart">
        <circle cx="110" cy="110" r={radius} className="donut-base" />
        {total > 0 ? items.map((item, index) => {
          const fraction = Number(item.count || 0) / total;
          const dash = fraction * circumference;
          const segment = (
            <circle
              key={item.status}
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={tones[index % tones.length]}
              strokeWidth="22"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 110 110)"
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return segment;
        }) : null}
        <text x="110" y="106" textAnchor="middle" className="donut-total-label">Total</text>
        <text x="110" y="132" textAnchor="middle" className="donut-total-value">{total}</text>
      </svg>

      <div className="donut-legend">
        {items.length ? items.map((item, index) => (
          <div key={item.status} className="donut-legend-item">
            <span className="donut-swatch" style={{ background: tones[index % tones.length] }} />
            <div>
              <strong>{item.label || item.status}</strong>
              <p>{item.count} order(s)</p>
            </div>
          </div>
        )) : <p className="muted-line">No order data yet.</p>}
      </div>
    </div>
  );
}

export default DonutStatusChart;
