export default function EmptyState({ emoji = "📭", title, message }) {
  return (
    <div className="empty">
      <div className="emoji">{emoji}</div>
      <h3>{title}</h3>
      {message && <p className="muted">{message}</p>}
    </div>
  );
}