import { Link } from "react-router-dom";
import ProgressBar from "../components/ProgressBar.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { SimpleBarChart, SimpleLineChart, SimplePieChart } from "../components/Charts.jsx";
import MyBlogsWidget from "./MyBlogsWidget.jsx";

// Every widget gets { data, m, actions }: raw data, derived metrics, and handlers.

function Stat({ icon, value, hint, progress }) {
  return (
    <div className="widget-stat">
      <div className="widget-stat-top">
        <span className="widget-stat-icon">{icon}</span>
        <span className="widget-stat-value">{value}</span>
      </div>
      {hint && <div className="muted">{hint}</div>}
      {progress !== undefined && <ProgressBar value={progress} />}
    </div>
  );
}

// Sample calendar: intensity is placeholder data until habit logs exist (Module 4).
function HabitCalendar() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const level = (d) => (d > now.getDate() ? "x" : (d * 7) % 5);
  return (
    <div className="cal">
      <div className="cal-head">{["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="cal-grid">
        {cells.map((d, i) =>
          d === null ? <span key={i} /> : (
            <span key={i} className={`cal-day lvl-${level(d)} ${d === now.getDate() ? "today" : ""}`}>{d}</span>
          )
        )}
      </div>
    </div>
  );
}

const money = (n) => `₹${n.toLocaleString("en-IN")}`;

function byCategory(expenses) {
  return Object.values(
    expenses.reduce((acc, e) => {
      acc[e.category] = acc[e.category] || { category: e.category, total: 0 };
      acc[e.category].total += e.amount;
      return acc;
    }, {})
  );
}

export const WIDGET_COMPONENTS = {
  // ---- Productivity ----
  productivityScore: ({ m }) => <Stat icon="⚡" value={`${m.score}/100`} hint="Habits 40% · Tasks 30% · Study 30%" progress={m.score} />,
  weeklyProductivity: ({ data }) => (
    <SimpleBarChart data={data.weeklyProgress} xKey="day" bars={[{ key: "completed", name: "Habits completed" }]} />
  ),
  monthlyOverview: ({ data }) => <SimpleLineChart data={data.monthlyTrend} xKey="month" yKey="rate" name="Completion %" />,
  dailyCompletion: ({ m }) => <Stat icon="🎯" value={`${m.percent}%`} hint={`${m.completed} of ${m.total} habits done`} progress={m.percent} />,

  // ---- Habits ----
  todayHabits: ({ data, actions }) => (
    <div>
      {data.habits.map((h) => (
        <div className="list-item" key={h.id}>
          <label className="row" style={{ margin: 0, cursor: "pointer" }}>
            <input type="checkbox" className="checkbox" style={{ width: 20 }} checked={h.done} onChange={() => actions.toggleHabit(h.id)} />
            <span className={h.done ? "done-text" : ""}>{h.title}</span>
          </label>
          <span className="muted">🔥 {h.streak}</span>
        </div>
      ))}
    </div>
  ),
  activeHabits: ({ m }) => <Stat icon="🌱" value={m.total} hint="habits being tracked" />,
  currentStreak: ({ m }) => <Stat icon="🔥" value={`${m.longestStreak} days`} hint="best running streak" />,
  longestStreak: ({ m }) => <Stat icon="🏆" value={`${m.bestEver} days`} hint="all-time best" />,
  habitCalendar: () => <HabitCalendar />,
  habitConsistency: ({ data }) => (
    <SimpleBarChart
      data={data.habits.map((h) => ({ name: h.title.split(" ")[0], streak: h.streak, best: h.longest }))}
      xKey="name"
      bars={[{ key: "streak", name: "Current streak" }, { key: "best", name: "Best streak" }]}
    />
  ),

  // ---- Learning ----
  learningGoals: ({ m }) =>
    m.activeGoals.length ? (
      <div>
        {m.activeGoals.map((g) => (
          <div key={g.id} style={{ marginBottom: 12 }}>
            <div className="list-item" style={{ border: "none", padding: "0 0 5px" }}>
              <span>{g.title}</span><span className="muted">{g.progress}%</span>
            </div>
            <ProgressBar value={g.progress} />
          </div>
        ))}
      </div>
    ) : <EmptyState emoji="📚" title="No active goals" />,
  learningProgress: ({ m }) => <Stat icon="🎓" value={`${m.learningPct}%`} hint={`${m.activeGoals.length} active goals`} progress={m.learningPct} />,
  studyTime: ({ m }) => <Stat icon="⏱️" value={`${m.studyHours} h`} hint={`about ${(m.studyHours / 7).toFixed(1)} h per day`} />,
  learningStreak: ({ data }) => <Stat icon="📅" value={`${data.learningStreak} days`} hint="studying in a row" />,
  skillProgress: ({ data }) => (
    <SimpleBarChart
      data={data.goals.map((g) => ({ name: g.title.split(" ")[0], progress: g.progress }))}
      xKey="name"
      bars={[{ key: "progress", name: "Progress %" }]}
    />
  ),

  // ---- Time management ----
  todayTasks: ({ data, actions }) => {
    const pending = data.tasks.filter((t) => !t.done);
    return pending.length ? (
      <div>
        {pending.map((t) => (
          <div className="list-item" key={t.id}>
            <label className="row" style={{ margin: 0, cursor: "pointer" }}>
              <input type="checkbox" className="checkbox" style={{ width: 20 }} checked={t.done} onChange={() => actions.toggleTask(t.id)} />
              <span>{t.title}</span>
            </label>
            <span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span>
          </div>
        ))}
      </div>
    ) : <EmptyState emoji="🎉" title="All caught up" />;
  },
  upcomingDeadlines: ({ data }) => {
    const items = data.tasks.filter((t) => !t.done).sort((a, b) => a.deadline.localeCompare(b.deadline));
    return items.length ? (
      <div>
        {items.map((t) => (
          <div className="list-item" key={t.id}>
            <div><div>{t.title}</div><div className="muted">Due {t.deadline}</div></div>
            <span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span>
          </div>
        ))}
      </div>
    ) : <EmptyState emoji="🎉" title="No deadlines" />;
  },
  completedTasks: ({ data, m }) => <Stat icon="☑️" value={`${m.tasksDone}/${data.tasks.length}`} hint={`${m.taskPct}% of tasks finished`} progress={m.taskPct} />,
  studySessions: ({ data }) => (
    <div>
      {data.studySessions.map((s) => (
        <div className="list-item" key={s.id}>
          <div><div>{s.topic}</div><div className="muted">{s.when}</div></div>
          <strong>{s.minutes} min</strong>
        </div>
      ))}
    </div>
  ),
  weeklyStudyHours: ({ data }) => <SimpleBarChart data={data.weeklyStudy} xKey="day" bars={[{ key: "hours", name: "Hours" }]} />,

  // ---- Expenses ----
  monthlyExpenses: ({ m }) => <Stat icon="💸" value={money(m.spent)} hint="spent this month" />,
  remainingBudget: ({ data, m }) => (
    <Stat icon="🏦" value={money(m.budgetLeft)} hint={`${m.budgetUsed}% of ${money(data.monthlyBudget)} used`} progress={m.budgetUsed} />
  ),
  expenseBreakdown: ({ data }) => <SimplePieChart data={byCategory(data.expenses)} nameKey="category" valueKey="total" />,
  recentTransactions: ({ data }) => (
    <div>
      {data.expenses.map((x) => (
        <div className="list-item" key={x.id}>
          <div><div>{x.title}</div><div className="muted">{x.category} · {x.date}</div></div>
          <strong>{money(x.amount)}</strong>
        </div>
      ))}
    </div>
  ),

  // ---- Social ----
  leaderboard: ({ data }) => (
    <div>
      {[...data.friends].sort((a, b) => b.points - a.points).map((f, i) => (
        <div className="list-item" key={f.id}><span>#{i + 1} {f.name}</span><strong>{f.points} pts</strong></div>
      ))}
    </div>
  ),
  friendsActivity: ({ data }) => (
    <div>
      {data.friendActivity.map((a) => (
        <div className="list-item" key={a.id}><div><div>{a.text}</div><div className="muted">{a.time}</div></div></div>
      ))}
    </div>
  ),
  achievements: ({ data }) => (
    <div>
      {data.achievements.map((a) => (
        <div className="list-item" key={a.id}>
          <div className="row"><span style={{ fontSize: "1.4rem" }}>{a.icon}</span><div><div>{a.title}</div><div className="muted">{a.when}</div></div></div>
        </div>
      ))}
    </div>
  ),

  // ---- General ----
  recentActivity: ({ data }) => (
    <div>{data.recentActivity.map((a) => <div className="list-item" key={a.id}><span>{a.text}</span></div>)}</div>
  ),
  notifications: ({ data }) => {
    const items = [...data.notifications].sort((a, b) => Number(a.read) - Number(b.read)).slice(0, 5);
    return (
      <div>
        {items.map((n) => (
          <div className="list-item" key={n.id}>
            <div><div>{n.text}</div><div className="muted">{n.type} · {n.time}</div></div>
            {!n.read && <span className="badge">New</span>}
          </div>
        ))}
      </div>
    );
  },
  quote: ({ data }) => <p className="widget-quote">“{data.quote}”</p>,
  quickActions: () => (
    <div className="quick-actions">
      <Link className="btn btn-sm" to="/habits">+ Habit</Link>
      <Link className="btn btn-sm" to="/time">+ Task</Link>
      <Link className="btn btn-sm" to="/expenses">+ Expense</Link>
      <Link className="btn btn-sm" to="/learning">+ Goal</Link>
    </div>
  ),
};