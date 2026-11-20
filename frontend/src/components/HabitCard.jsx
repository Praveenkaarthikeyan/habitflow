export default function HabitCard({ habit, onToggle, onDelete }) {
  return (
    <div className="card habit-card">
      <div className="habit-top">
        <div>
          <h3 className={habit.done ? "done-text" : ""}>{habit.title}</h3>
          <p className="muted">{habit.description}</p>
        </div>
        <button className="icon-btn" onClick={() => onDelete(habit.id)} aria-label="Delete habit">🗑️</button>
      </div>
      <div className="row" style={{ flexWrap: "wrap" }}>
        <span className="badge">{habit.category}</span>
        <span className="badge">{habit.frequency}</span>
      </div>
      <div className="muted">🔥 {habit.streak}-day streak · Best: {habit.longest}</div>
      <button
        className={`btn btn-sm ${habit.done ? "btn-ghost" : ""}`}
        onClick={() => onToggle(habit.id)}
      >
        {habit.done ? "✓ Completed today (undo)" : "Mark as done"}
      </button>
    </div>
  );
}