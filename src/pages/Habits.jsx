import { useState } from "react";
import HabitCard from "../components/HabitCard.jsx";
import Modal from "../components/Modal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { initialHabits, categories } from "../data/mockData.js";

const emptyForm = { title: "", description: "", category: "Health", frequency: "Daily" };

export default function Habits() {
  const [habits, setHabits] = useState(initialHabits);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const visible = filter === "All" ? habits : habits.filter((h) => h.category === filter);

  const toggle = (id) =>
    setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));

  const remove = (id) => {
    if (window.confirm("Delete this habit?")) setHabits((hs) => hs.filter((h) => h.id !== id));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    setHabits([{ ...form, id: Date.now(), streak: 0, longest: 0, done: false }, ...habits]);
    setForm(emptyForm);
    setError("");
    setShowModal(false);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Habits</h1>
          <p className="muted">Build consistency, one day at a time.</p>
        </div>
        <button className="btn" onClick={() => setShowModal(true)}>+ New Habit</button>
      </div>

      <div className="tabs">
        {["All", ...categories].map((c) => (
          <button key={c} className={`chip ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="card"><EmptyState emoji="🌱" title="No habits here yet" message="Create a habit to get started." /></div>
      ) : (
        <div className="grid grid-3">
          {visible.map((h) => (
            <HabitCard key={h.id} habit={h} onToggle={toggle} onDelete={remove} />
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Create Habit" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Read 20 pages" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" rows="2" value={form.description} onChange={handleChange} />
            </div>
            <div className="form-row form-group">
              <div>
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label>Frequency</label>
                <select name="frequency" value={form.frequency} onChange={handleChange}>
                  <option>Daily</option>
                  <option>Weekly</option>
                </select>
              </div>
            </div>
            {error && <p style={{ color: "var(--danger)", marginBottom: 10 }}>{error}</p>}
            <button className="btn" type="submit" style={{ width: "100%" }}>Save Habit</button>
          </form>
        </Modal>
      )}
    </>
  );
}