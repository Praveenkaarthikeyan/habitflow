import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "🏠" },
  { to: "/habits", label: "Habits", icon: "✅" },
  { to: "/learning", label: "Learning Tracker", icon: "📚" },
  { to: "/time", label: "Time Management", icon: "⏱️" },
  { to: "/expenses", label: "Expense Tracker", icon: "💰" },
  { to: "/statistics", label: "Statistics", icon: "📊" },
  { to: "/friends", label: "Friends", icon: "👥" },
  { to: "/notifications", label: "Notifications", icon: "🔔" },
  { to: "/profile", label: "Profile & Settings", icon: "⚙️" },
];

export default function Sidebar({ open, onNavigate }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="logo">🌀 HabitFlow</div>
      <nav>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            onClick={onNavigate}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <span>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}