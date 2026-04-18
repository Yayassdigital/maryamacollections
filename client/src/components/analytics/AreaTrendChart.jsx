function AreaTrendChart({ points = [], formatter = (value) => value }) {
  const values = points.map((point) => Number(point.value || point.totalSales || 0));
  const labels = points.map((point) => point.label);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const width = 520;
  const height = 260;
  const padding = 24;
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;

  const getY = (value) => {
    if (max === min) return height / 2;
    return height - padding - ((value - min) / (max - min)) * (height - padding * 2);
  };

  const chartPoints = values.map((value, index) => `${padding + step * index},${getY(value)}`);
  const polylinePoints = chartPoints.join(" ");
  const areaPoints = values.length
    ? [`${padding},${height - padding}`, ...chartPoints, `${padding + step * (values.length - 1)},${height - padding}`].join(" ")
    : "";

  return (
    <div className="chart-shell">
      <svg viewBox={`0 0 ${width} ${height}`} className="area-chart" role="img" aria-label="Sales trend chart">
        {[0, 1, 2, 3].map((line) => {
          const y = padding + ((height - padding * 2) / 3) * line;
          return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} className="chart-grid-line" />;
        })}
        {areaPoints ? <polygon points={areaPoints} className="area-fill" /> : null}
        {polylinePoints ? <polyline points={polylinePoints} className="trend-line" /> : null}
        {values.map((value, index) => {
          const x = padding + step * index;
          const y = getY(value);
          return (
            <g key={`${labels[index]}-${value}`}>
              <circle cx={x} cy={y} r="5" className="trend-point" />
              <text x={x} y={height - 6} textAnchor="middle" className="chart-label">{labels[index]}</text>
            </g>
          );
        })}
      </svg>
      {values.length ? (
        <div className="chart-legend-row">
          <div>
            <span className="mini-label">Peak Month</span>
            <strong>{labels[values.indexOf(max)] || "--"}</strong>
          </div>
          <div>
            <span className="mini-label">Peak Sales</span>
            <strong>{formatter(max)}</strong>
          </div>
        </div>
      ) : <p className="muted-line">No chart data yet.</p>}
    </div>
  );
}

export default AreaTrendChart;
