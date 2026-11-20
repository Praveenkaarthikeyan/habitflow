export default function ProgressBar({ value, color }) {
  const safe = Math.max(0, Math.min(100, value));
  const auto = safe >= 100 ? "var(--success)" : "var(--primary)";
  return (
    <div className="progress" role="progressbar" aria-valuenow={safe} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-fill" style={{ width: `${safe}%`, background: color || auto }} />
    </div>
  );
}