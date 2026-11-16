import { useState } from "react";
import StatisticsCard from "../components/StatisticsCard.jsx";
import { SimpleBarChart, SimpleLineChart, SimplePieChart } from "../components/Charts.jsx";
import {
  initialHabits, initialGoals, initialTasks, initialExpenses,
  weeklyProgress, monthlyTrend, weeklyStudy, monthlyExpenses, monthlyBudget,
} from "../data/mockData.js";

const filters = ["Last 7 days", "Last 30 days", "Current month", "Previous month", "Last 3 months", "Custom"];

export default function Statistics() {
  const [filter, setFilter] = useState("Last 7 days");

  const habitRate = Math.round(
    (weeklyProgress.reduce((s, d) => s + d.completed, 0) / weeklyProgress.reduce((s, d) => s + d.total, 0)) * 100
  );
  const studyHours = weeklyStudy.reduce((s, d) => s + d.hours, 0);
  const tasksDone = initialTasks.filter((t) => t.done).length;
  const spent = initialExpenses.reduce((s, e) => s + e.amount, 0);
  const completedGoals = initialGoals.filter((g) => g.status === "Completed").length;
  const best = [...initialHabits].sort((a, b) => b.streak - a.streak)[0];

  const byCategory = Object.values(
    initialExpenses.reduce((acc, e) => {
      acc[e.category] = acc[e.category] || { category: e.category, total: 0 };
      acc[e.category].total += e.amount;
      return acc;
    }, {})
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Statistics</h1>
          <p className="muted">Charts use sample data now. Real filters arrive in Module 6.</p>
        </div>
      </div>

      <div className="tabs">
        {filters.map((f) => (
          <button key={f} className={`chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <h2>Overall Productivity</h2>
      <div className="grid grid-4 mb">
        <StatisticsCard icon="✅" label="Active habits" value={initialHabits.length} />
        <StatisticsCard icon="📈" label="Habit completion" value={`${habitRate}%`} />
        <StatisticsCard icon="⏱️" label="Study time" value={`${studyHours} h`} />
        <StatisticsCard icon="📝" label="Tasks completed" value={tasksDone} />
      </div>

      <h2>Habits</h2>
      <div className="grid grid-2 mb">
        <div className="card"><h3>Weekly completion</h3><SimpleBarChart data={weeklyProgress} xKey="day" bars={[{ key: "completed", name: "Completed" }]} /></div>
        <div className="card"><h3>Monthly completion rate (%)</h3><SimpleLineChart data={monthlyTrend} xKey="month" yKey="rate" name="Rate" /></div>
      </div>
      <p className="muted mb">Best streak: <strong>{best.title}</strong> ({best.streak} days)</p>

      <h2>Learning</h2>
      <div className="grid grid-2 mb">
        <div className="card"><h3>Weekly study time (hours)</h3><SimpleBarChart data={weeklyStudy} xKey="day" bars={[{ key: "hours", name: "Hours" }]} /></div>
        <div className="card">
          <h3>Goals overview</h3>
          <div className="list-item"><span>Total goals</span><strong>{initialGoals.length}</strong></div>
          <div className="list-item"><span>Completed</span><strong>{completedGoals}</strong></div>
          <div className="list-item"><span>Active</span><strong>{initialGoals.length - completedGoals}</strong></div>
        </div>
      </div>

      <h2>Expenses</h2>
      <div className="grid grid-3">
        <div className="card"><h3>Monthly spending (₹)</h3><SimpleLineChart data={monthlyExpenses} xKey="month" yKey="total" name="Spent" /></div>
        <div className="card"><h3>By category</h3><SimplePieChart data={byCategory} nameKey="category" valueKey="total" /></div>
        <div className="card">
          <h3>Budget utilization</h3>
          <div className="stat-value" style={{ marginTop: 20 }}>{Math.round((spent / monthlyBudget) * 100)}%</div>
          <p className="muted">₹{spent} of ₹{monthlyBudget}</p>
        </div>
      </div>
    </>
  );
}