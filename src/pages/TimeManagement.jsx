import { useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import { initialTasks } from "../data/mockData.js";

export default function TimeManagement() {
  const [tasks, setTasks] = useState(initialTasks);
  const [form, setForm] = useState({ title: "", priority: "Medium", category: "College", deadline: "" });

  const addTask = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setTasks([{ ...form, id: Date.now(), done: false }, ...tasks]);
    setForm({ ...form, title: "", deadline: "" });
  };

  const toggle = (id) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTasks((ts) => ts.filter((t) => t.id !== id));

  const planned = tasks.filter((t) => !t.done);
  const completed = tasks.filter((t) => t.done);

  const TaskRow = ({ t }) => (
    <div className="list-item">
      <label className="row" style={{ margin: 0, cursor: "pointer" }}>
        <input type="checkbox" className="checkbox" checked={t.done} onChange={() => toggle(t.id)} style={{ width: 20 }} />
        <div>
          <div className={t.done ? "done-text" : ""}>{t.title}</div>
          <div className="muted">{t.category} · {t.deadline || "No deadline"}</div>
        </div>
      </label>
      <div className="row">
        <span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span>
        <button className="icon-btn" onClick={() => remove(t.id)} aria-label="Delete task">🗑️</button>
      </div>
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Time Management</h1>
          <p className="muted">Plan your day and finish what matters.</p>
        </div>
      </div>

      <form className="card mb" onSubmit={addTask}>
        <h2>Add Task</h2>
        <div className="form-row">
          <div><label>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" /></div>
          <div>
            <label>Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </div>
          <div>
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>College</option><option>Learning</option><option>Personal</option>
            </select>
          </div>
          <div><label>Deadline</label><input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
        </div>
        <button className="btn" type="submit" style={{ marginTop: 14 }}>Add Task</button>
      </form>

      <div className="grid grid-2">
        <div className="card">
          <h2>Planned ({planned.length})</h2>
          {planned.length ? planned.map((t) => <TaskRow key={t.id} t={t} />) : <EmptyState emoji="🎉" title="All caught up" />}
        </div>
        <div className="card">
          <h2>Completed ({completed.length})</h2>
          {completed.length ? completed.map((t) => <TaskRow key={t.id} t={t} />) : <EmptyState emoji="📝" title="Nothing completed yet" />}
        </div>
      </div>
    </>
  );
}