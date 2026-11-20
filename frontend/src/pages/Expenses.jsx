import { useState } from "react";
import ProgressBar from "../components/ProgressBar.jsx";
import StatisticsCard from "../components/StatisticsCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { SimplePieChart } from "../components/Charts.jsx";
import { initialExpenses, expenseCategories, monthlyBudget } from "../data/mockData.js";

export default function Expenses() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [form, setForm] = useState({ title: "", amount: "", category: "Food", date: "" });

  const spent = expenses.reduce((s, e) => s + e.amount, 0);
  const usage = Math.round((spent / monthlyBudget) * 100);
  const barColor = usage >= 100 ? "var(--danger)" : usage >= 80 ? "var(--warning)" : "var(--success)";

  const byCategory = Object.values(
    expenses.reduce((acc, e) => {
      acc[e.category] = acc[e.category] || { category: e.category, total: 0 };
      acc[e.category].total += e.amount;
      return acc;
    }, {})
  );

  const addExpense = (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.title.trim() || !(amount > 0)) return;
    setExpenses([{ ...form, amount, id: Date.now(), date: form.date || new Date().toISOString().slice(0, 10) }, ...expenses]);
    setForm({ title: "", amount: "", category: "Food", date: "" });
  };

  const remove = (id) => setExpenses((es) => es.filter((x) => x.id !== id));

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Expense Tracker</h1>
          <p className="muted">Keep your student budget under control.</p>
        </div>
      </div>

      <div className="grid grid-4 mb">
        <StatisticsCard icon="💸" label="Spent this month" value={`₹${spent}`} />
        <StatisticsCard icon="🏦" label="Monthly budget" value={`₹${monthlyBudget}`} />
        <StatisticsCard icon="🧮" label="Remaining" value={`₹${Math.max(0, monthlyBudget - spent)}`} />
      </div>

      <div className="card mb">
        <div className="list-item" style={{ border: "none", padding: "0 0 8px" }}>
          <h2 style={{ margin: 0 }}>Budget Utilization</h2>
          <span>{usage}%</span>
        </div>
        <ProgressBar value={usage} color={barColor} />
        {usage >= 80 && (
          <p style={{ color: "var(--warning)", marginTop: 8 }}>
            ⚠️ {usage >= 100 ? "You have exceeded your budget." : "You are close to your budget limit."}
          </p>
        )}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>Add Expense</h2>
          <form onSubmit={addExpense}>
            <div className="form-group"><label>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-row form-group">
              <div><label>Amount (₹)</label><input type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
              <div>
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {expenseCategories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <button className="btn" type="submit">Add Expense</button>
          </form>
        </div>

        <div className="card">
          <h2>Spending by Category</h2>
          {byCategory.length ? <SimplePieChart data={byCategory} nameKey="category" valueKey="total" /> : <EmptyState title="No expenses yet" />}
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h2>History</h2>
        {expenses.length ? expenses.map((x) => (
          <div className="list-item" key={x.id}>
            <div>
              <div>{x.title}</div>
              <div className="muted">{x.category} · {x.date}</div>
            </div>
            <div className="row">
              <strong>₹{x.amount}</strong>
              <button className="icon-btn" onClick={() => remove(x.id)} aria-label="Delete expense">🗑️</button>
            </div>
          </div>
        )) : <EmptyState emoji="🧾" title="No expenses recorded" />}
      </div>
    </>
  );
}