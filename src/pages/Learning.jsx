import { useState } from "react";
import ProgressBar from "../components/ProgressBar.jsx";
import Modal from "../components/Modal.jsx";
import { SimpleBarChart } from "../components/Charts.jsx";
import { initialGoals, weeklyStudy } from "../data/mockData.js";

export default function Learning() {
  const [goals, setGoals] = useState(initialGoals);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", deadline: "" });

  const updateProgress = (id, value) =>
    setGoals((gs) =>
      gs.map((g) =>
        g.id === id
          ? { ...g, progress: value, status: value >= 100 ? "Completed" : "Active" }
          : g
      )
    );

  const remove = (id) => setGoals((gs) => gs.filter((g) => g.id !== id));

  const addGoal = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setGoals([{ ...form, id: Date.now(), progress: 0, status: "Active", notes: "" }, ...goals]);
    setForm({ title: "", category: "", deadline: "" });
    setShowModal(false);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Learning Tracker</h1>
          <p className="muted">Track every skill you are building.</p>
        </div>
        <button className="btn" onClick={() => setShowModal(true)}>+ New Goal</button>
      </div>

      <div className="grid grid-2 mb">
        <div className="card">
          <h2>Weekly Study Hours</h2>
          <SimpleBarChart data={weeklyStudy} xKey="day" bars={[{ key: "hours", name: "Hours" }]} />
        </div>
        <div className="card">
          <h2>Skill-wise Progress</h2>
          <SimpleBarChart
            data={goals.map((g) => ({ name: g.title.split(" ")[0], progress: g.progress }))}
            xKey="name"
            bars={[{ key: "progress", name: "Progress %" }]}
          />
        </div>
      </div>

      <div className="grid grid-3">
        {goals.map((g) => (
          <div className="card" key={g.id}>
            <div className="habit-top">
              <div>
                <h3>{g.title}</h3>
                <span className="badge">{g.category || "General"}</span>
              </div>
              <button className="icon-btn" onClick={() => remove(g.id)} aria-label="Delete goal">🗑️</button>
            </div>
            <div style={{ margin: "14px 0 6px" }}><ProgressBar value={g.progress} /></div>
            <div className="list-item" style={{ border: "none", padding: 0 }}>
              <span className="muted">{g.progress}% · {g.status}</span>
              <span className="muted">Due {g.deadline || "—"}</span>
            </div>
            <input
              type="range" min="0" max="100" value={g.progress}
              onChange={(e) => updateProgress(g.id, Number(e.target.value))}
              style={{ padding: 0, marginTop: 10 }}
            />
            {g.notes && <p className="muted" style={{ marginTop: 8 }}>📝 {g.notes}</p>}
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="New Learning Goal" onClose={() => setShowModal(false)}>
          <form onSubmit={addGoal}>
            <div className="form-group">
              <label>Goal title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Web Development" />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <button className="btn" type="submit" style={{ width: "100%" }}>Add Goal</button>
          </form>
        </Modal>
      )}
    </>
  );
}