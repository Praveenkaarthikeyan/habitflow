import { NavLink } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import { useProfile } from "../context/ProfileContext.jsx";

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

export default function Sidebar({ expanded, mobileOpen, onToggle, onNavigate }) {
  const { profile } = useProfile();

  return (
    <aside
      className={`sidebar ${expanded ? "expanded" : ""} ${mobileOpen ? "open" : ""}`}
      aria-label="Main navigation"
    >
      <div className="sidebar-head">
        <span className="logo-icon">🌀</span>
        <span className="logo-text nav-label">HabitFlow</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            onClick={onNavigate}
            data-tooltip={l.label}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{l.icon}</span>
            <span className="nav-label">{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <NavLink
          to="/profile"
          onClick={onNavigate}
          data-tooltip={profile.name}
          className={({ isActive }) => `user-chip ${isActive ? "active" : ""}`}
        >
          <Avatar size={36} />
          <span className="nav-label user-name">{profile.name}</span>
        </NavLink>

        <button
          className="sidebar-toggle"
          onClick={onToggle}
          data-tooltip={expanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={expanded}
        >
          <span className="nav-icon">{expanded ? "«" : "»"}</span>
          <span className="nav-label">Collapse</span>
        </button>
      </div>
    </aside>
  );
}