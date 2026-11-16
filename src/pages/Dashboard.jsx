import { useState } from "react";
import StatisticsCard from "../components/StatisticsCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import { SimpleBarChart } from "../components/Charts.jsx";
import {
  initialHabits, initialGoals, initialTasks, weeklyProgress,
  monthlyBudget, initialExpenses, motivationalMessages,
} from "../data/mockData.js";

export default function Dashboard() {
  const [habits, setHabits] = useState(initialHabits);

  const total = habits.length;
  const completed = habits.filter((h) => h.done).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const longest = Math.max(0, ...habits.map((h) => h.streak));
  const activeGoals = initialGoals.filter((g) => g.status === "Active");
  const overallLearning = activeGoals.length
    ? Math.round(activeGoals.reduce((s, g) => s + g.progress, 0) / activeGoals.length)
    : 0;
  const spent = initialExpenses.reduce((s, e) => s + e.amount, 0);
  const tasksDone = initialTasks.filter((t) => t.done).length;
  const upcoming = initialTasks.filter((t) => !t.done).sort((a, b) => a.deadline.localeCompare(b.deadline));
  const message = motivationalMessages[new Date().getDate() % motivationalMessages.length];

  const toggle = (id) =>
    setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));

  return (
    <>
      <div className="banner mb">
        <h1>Welcome back, Student 👋</h1>
        <p style={{ marginTop: 6 }}>{message}</p>
      </div>

      <div className="grid grid-4 mb">
        <StatisticsCard icon="🎯" label="Today's completion" value={`${percent}%`} hint={`${completed} done · ${total - completed} pending`} />
        <StatisticsCard icon="🔥" label="Longest current streak" value={`${longest} days`} />
        <StatisticsCard icon="📚" label="Learning progress" value={`${overallLearning}%`} hint={`${activeGoals.length} active goals`} />
        <StatisticsCard icon="💰" label="Budget remaining" value={`₹${monthlyBudget - spent}`} hint={`Spent ₹${spent} of ₹${monthlyBudget}`} />
      </div>

      <div className="grid grid-2 mb">
        <div className="card">
          <h2>Today's Habits</h2>
          <ProgressBar value={percent} />
          <div style={{ marginTop: 10 }}>
            {habits.map((h) => (
              <div className="list-item" key={h.id}>
                <label className="row" style={{ margin: 0, cursor: "pointer" }}>
                  <input type="checkbox" className="checkbox" checked={h.done} onChange={() => toggle(h.id)} style={{ width: 20 }} />
                  <span className={h.done ? "done-text" : ""}>{h.title}</span>
                </label>
                <span className="muted">🔥 {h.streak}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Weekly Progress</h2>
          <SimpleBarChart
            data={weeklyProgress}
            xKey="day"
            bars={[{ key: "completed", name: "Completed" }, { key: "total", name: "Total" }]}
          />
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <h2>Learning Goals</h2>
          {activeGoals.map((g) => (
            <div key={g.id} style={{ marginBottom: 14 }}>
              <div className="list-item" style={{ border: "none", padding: "0 0 6px" }}>
                <span>{g.title}</span><span className="muted">{g.progress}%</span>
              </div>
              <ProgressBar value={g.progress} />
            </div>
          ))}
        </div>

        <div className="card">
          <h2>Upcoming Deadlines</h2>
          {upcoming.map((t) => (
            <div className="list-item" key={t.id}>
              <div>
                <div>{t.title}</div>
                <div className="muted">Due {t.deadline}</div>
              </div>
              <span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span>
            </div>
          ))}
          <p className="muted" style={{ marginTop: 10 }}>Tasks completed today: {tasksDone}</p>
        </div>

        <div className="card">
          <h2>Recent Activity</h2>
          <div className="list-item"><span>✅ Completed "Morning Workout"</span></div>
          <div className="list-item"><span>📚 Updated Java progress to 65%</span></div>
          <div className="list-item"><span>💰 Added ₹120 for Food</span></div>
          <div className="list-item"><span>🏅 Earned Seven-Day Streak badge</span></div>
        </div>
      </div>
    </>
  );
}