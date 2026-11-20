export default function StatisticsCard({ icon, label, value, hint }) {
  return (
    <div className="card stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="muted">{label}</div>
        <div className="stat-value">{value}</div>
        {hint && <div className="muted">{hint}</div>}
      </div>
    </div>
  );
}